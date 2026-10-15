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
) => {
  const element = zoomArea().element();
  const rect = element.getBoundingClientRect();
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId,
      pointerType,
      isPrimary: pointerId === 1,
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
