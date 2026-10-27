import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  LightBox,
  LightBoxGallery,
  LightBoxGalleryItem,
} from "@/components/LightBox";
import LightBoxTrigger from "@/components/LightBox/components/LightBoxTrigger";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import type { ReactNode } from "react";

const zoomArea = () => page.getByRole("group", { name: "Zoomable view" });

/* Read through `DOMMatrix`: engines serialize the inline style differently. */
const zoomOf = () => {
  const content = zoomArea().element().firstElementChild;
  if (!(content instanceof HTMLElement)) {
    throw new Error("The zoom area has no content");
  }
  const matrix = new DOMMatrix(content.style.transform);
  return { scale: matrix.a, x: matrix.e, y: matrix.f };
};

const scaleOf = () => zoomOf().scale;

const content = (
  <div
    data-testid="content"
    style={{ width: 400, height: 200, background: "teal" }}
  />
);

const openLightBox = async (children: ReactNode = content) => {
  render(
    <LightBoxTrigger>
      <Button>Open</Button>
      <LightBox withZoom>{children}</LightBox>
    </LightBoxTrigger>,
  );
  await page.getByRole("button", { name: "Open" }).click();
  await expect.element(zoomArea()).toBeVisible();
};

/* Synthetic pointers are not active pointers, so capturing them throws. */
beforeEach(() => {
  vi.spyOn(Element.prototype, "setPointerCapture").mockImplementation(
    () => undefined,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Dispatches a pointer event at an offset from the zoom area's center. */
const pointer = (
  type: "pointerdown" | "pointermove" | "pointerup",
  pointerId: number,
  x: number,
  y: number,
  pointerType = "touch",
  isPrimary = pointerId === 1,
) => {
  const element = zoomArea().element();
  const rect = element.getBoundingClientRect();
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId,
      pointerType,
      isPrimary,
      clientX: rect.left + rect.width / 2 + x,
      clientY: rect.top + rect.height / 2 + y,
    }),
  );
};

test("a click zooms in and a second click zooms out", async () => {
  await openLightBox();

  await zoomArea().click();
  await expect.poll(zoomOf).toEqual({ scale: 2, x: 0, y: 0 });

  await zoomArea().click();
  await expect.poll(zoomOf).toEqual({ scale: 1, x: 0, y: 0 });
});

test("the keyboard zooms and moves the zoomed content", async () => {
  await openLightBox();
  await expect
    .element(zoomArea())
    .toHaveAccessibleDescription(/the arrow keys move the zoomed image/);
  zoomArea().element().focus();

  await userEvent.keyboard("+");
  await expect.poll(zoomOf).toEqual({ scale: 1.5, x: 0, y: 0 });

  await userEvent.keyboard("-");
  await expect.poll(zoomOf).toEqual({ scale: 1, x: 0, y: 0 });

  await userEvent.keyboard("{Enter}");
  await userEvent.keyboard("{ArrowRight}");
  await expect.poll(zoomOf).toEqual({ scale: 2, x: -50, y: 0 });
});

test("the mouse wheel zooms up to the maximum scale", async () => {
  await openLightBox();
  const element = zoomArea().element();

  const wheel = (deltaY: number) =>
    element.dispatchEvent(
      new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY }),
    );

  wheel(-2000);
  await expect.poll(scaleOf).toBe(3);

  wheel(2000);
  await expect.poll(zoomOf).toEqual({ scale: 1, x: 0, y: 0 });
});

test("a Safari trackpad pinch zooms instead of the page", async () => {
  await openLightBox();
  const element = zoomArea().element();
  const rect = element.getBoundingClientRect();

  /* Safari's `GestureEvent` has no constructor elsewhere. */
  const gesture = (type: string, scale: number) => {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, {
      scale,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    });
    element.dispatchEvent(event);
    return event;
  };

  expect(gesture("gesturestart", 1).defaultPrevented).toBe(true);
  expect(gesture("gesturechange", 2).defaultPrevented).toBe(true);
  await expect.poll(zoomOf).toEqual({ scale: 2, x: 0, y: 0 });

  gesture("gesturechange", 3);
  await expect.poll(scaleOf).toBe(3);
});

test("Ctrl and Cmd with plus or minus stay the browser's", async () => {
  await openLightBox();
  const element = zoomArea().element();

  const zoomEvent = new KeyboardEvent("keydown", {
    key: "=",
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(zoomEvent);

  expect(zoomEvent.defaultPrevented).toBe(false);
  expect(scaleOf()).toBe(1);
});

test("a pinch zooms around the midpoint of both fingers", async () => {
  await openLightBox();

  pointer("pointerdown", 1, -50, 0);
  pointer("pointerdown", 2, 50, 0);
  pointer("pointermove", 2, 150, 0);
  pointer("pointerup", 2, 150, 0);
  pointer("pointerup", 1, -50, 0);

  /* Twice the distance, and the midpoint moved 50px to the right. */
  await expect.poll(zoomOf).toEqual({ scale: 2, x: 50, y: 0 });
});

test("a double tap toggles the zoom", async () => {
  await openLightBox();

  const tap = () => {
    pointer("pointerdown", 1, 0, 0);
    pointer("pointerup", 1, 0, 0);
  };

  tap();
  expect(zoomOf()).toEqual({ scale: 1, x: 0, y: 0 });

  tap();
  await expect.poll(zoomOf).toEqual({ scale: 2, x: 0, y: 0 });
});

test("a gallery zooms its current item only", async () => {
  await openLightBox(
    <LightBoxGallery>
      <LightBoxGalleryItem>
        {content}
        <Text>Starship</Text>
      </LightBoxGalleryItem>
      <LightBoxGalleryItem>
        <Text>Freighter</Text>
      </LightBoxGalleryItem>
    </LightBoxGallery>,
  );

  expect(document.querySelectorAll('[role="group"]')).toHaveLength(1);

  zoomArea().element().focus();
  await userEvent.keyboard("{Enter}");
  await expect.poll(scaleOf).toBe(2);

  /* Zoomed, a drag and the arrows move the item instead of paging. */
  pointer("pointerdown", 1, 0, 0, "mouse");
  pointer("pointermove", 1, -100, 0, "mouse");
  pointer("pointerup", 1, -100, 0, "mouse");
  await userEvent.keyboard("{ArrowRight}");

  await expect.element(page.getByText("Starship")).toBeVisible();
  expect(zoomOf().x).toBeLessThan(0);

  await userEvent.keyboard("{Enter}");
  await userEvent.keyboard("{ArrowRight}");

  await expect.element(page.getByText("Freighter")).toBeVisible();
});

test("a gallery does not page after a wheel zoom", async () => {
  await openLightBox(
    <LightBoxGallery>
      <LightBoxGalleryItem>
        {content}
        <Text>Starship</Text>
      </LightBoxGalleryItem>
      <LightBoxGalleryItem>
        <Text>Freighter</Text>
      </LightBoxGalleryItem>
    </LightBoxGallery>,
  );
  await expect
    .element(page.getByRole("region", { name: "Image gallery" }))
    .toHaveFocus();

  zoomArea()
    .element()
    .dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: -500,
      }),
    );
  await expect.poll(scaleOf).toBeGreaterThan(1);

  await userEvent.keyboard("{ArrowRight}");

  await expect.element(page.getByText("Starship")).toBeVisible();
  expect(page.getByText("Freighter").query()).toBeNull();
});

test("a gallery button pages once after a pinch", async () => {
  await openLightBox(
    <LightBoxGallery>
      <LightBoxGalleryItem>
        <Text>Starship</Text>
      </LightBoxGalleryItem>
      <LightBoxGalleryItem>
        {content}
        <Text>Freighter</Text>
      </LightBoxGalleryItem>
      <LightBoxGalleryItem>
        <Text>Shuttle</Text>
      </LightBoxGalleryItem>
    </LightBoxGallery>,
  );
  zoomArea().element().focus();
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(page.getByText("Freighter")).toBeVisible();

  const next = page.getByRole("button", { name: "Next" });
  const nextRect = next.element().getBoundingClientRect();
  const zoomRect = zoomArea().element().getBoundingClientRect();
  /* Read as a swipe from the first finger to the button, the press would
     page back. */
  const start =
    nextRect.left +
    nextRect.width / 2 -
    200 -
    (zoomRect.left + zoomRect.width / 2);

  /* Touch pointer ids differ from the mouse's, as on a real device. */
  pointer("pointerdown", 11, start, 0, "touch", true);
  pointer("pointerdown", 12, start + 100, 0, "touch", false);
  pointer("pointermove", 12, start + 200, 0, "touch", false);
  pointer("pointerup", 12, start + 200, 0, "touch", false);
  pointer("pointerup", 11, start, 0, "touch", true);
  await expect.poll(scaleOf).toBeGreaterThan(1);

  await next.click();

  await expect.element(page.getByText("Shuttle")).toBeVisible();
});

test("paging from the zoom area leaves the focus in the gallery", async () => {
  await openLightBox(
    <LightBoxGallery>
      <LightBoxGalleryItem>
        <Text>Starship</Text>
      </LightBoxGalleryItem>
      <LightBoxGalleryItem>
        <Text>Freighter</Text>
      </LightBoxGalleryItem>
      <LightBoxGalleryItem>
        <Text>Shuttle</Text>
      </LightBoxGalleryItem>
    </LightBoxGallery>,
  );
  const gallery = page.getByRole("region", { name: "Image gallery" });

  for (const next of ["Freighter", "Shuttle"]) {
    zoomArea().element().focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByText(next)).toBeVisible();
    /* Not polled: the light box's focus containment would catch a lost focus
       a frame later. */
    expect(document.activeElement).toBe(gallery.element());
  }
});

test("a smaller window keeps the zoomed content covering the screen", async () => {
  const { innerWidth, innerHeight } = window;
  await openLightBox();

  /* Twice the 400px content, moved 150px to the right. */
  pointer("pointerdown", 1, -150, 0, "mouse");
  pointer("pointerup", 1, -150, 0, "mouse");
  await expect.poll(zoomOf).toEqual({ scale: 2, x: 150, y: 0 });

  await page.viewport(600, innerHeight);
  try {
    const content = zoomArea().element().firstElementChild;
    await expect
      .poll(() => content?.getBoundingClientRect().left)
      .toBeLessThanOrEqual(0);
  } finally {
    await page.viewport(innerWidth, innerHeight);
  }
});
