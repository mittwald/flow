import { useRef, useState } from "react";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { CoachMark } from "@/components/CoachMark";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { useOverlayController } from "@/lib/controller";

const Spotlight = (props: { dismissLabel?: string; tall?: boolean }) => {
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController("CoachMark", {
    isDefaultOpen: true,
  });

  return (
    <div style={{ height: props.tall ? "4000px" : undefined }}>
      <button ref={anchor} data-testid="anchor">
        Anchor
      </button>
      <CoachMark
        anchorRef={anchor}
        controller={controller}
        dismissLabel={props.dismissLabel}
      >
        <Heading>New around here</Heading>
        <Text data-testid="hint">
          This button now does more than it used to.
        </Text>
      </CoachMark>
    </div>
  );
};

const offsetToAnchor = () => {
  const anchor = document.querySelector("[data-testid='anchor']");
  const popover = document.querySelector(
    "[class*='flow--popover--content']",
  )?.parentElement;
  if (!anchor || !popover) {
    return null;
  }
  return Math.round(
    popover.getBoundingClientRect().top - anchor.getBoundingClientRect().top,
  );
};

test("A coach mark opens on its own and leaves the page alone", async () => {
  render(<Spotlight />);

  await expect.element(page.getByTestId("hint")).toBeInTheDocument();
  await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  expect(document.documentElement.style.overflow).toBe("");
  expect(document.activeElement).toBe(document.body);
});

test("A coach mark is dismissed by its own button", async () => {
  render(<Spotlight />);

  await expect.element(page.getByTestId("hint")).toBeInTheDocument();

  await page.getByRole("button", { name: "Got it" }).click();

  await expect.element(page.getByTestId("hint")).not.toBeInTheDocument();
});

test("The dismiss label can be replaced", async () => {
  render(<Spotlight dismissLabel="Try it" />);

  await expect
    .element(page.getByRole("button", { name: "Try it" }))
    .toBeInTheDocument();
});

test("Escape dismisses a coach mark", async () => {
  render(<Spotlight />);

  await expect.element(page.getByTestId("hint")).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");

  await expect.element(page.getByTestId("hint")).not.toBeInTheDocument();
});

test("A coach mark is rendered where it was written, not at the end of the body", async () => {
  render(<Spotlight />);

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  const anchor = document.querySelector("[data-testid='anchor']");
  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;

  expect(anchor).not.toBeNull();
  expect(popover).not.toBeUndefined();
  expect(anchor?.parentElement).toBe(popover?.parentElement);
  expect(popover && anchor?.compareDocumentPosition(popover)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});

test("The anchor refers to the coach mark with aria-details", async () => {
  render(<Spotlight />);

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  const anchor = document.querySelector("[data-testid='anchor']");
  const details = anchor?.getAttribute("aria-details");

  expect(details).toBeTruthy();
  expect(document.getElementById(details ?? "")).toContain(hint.element());
});

test("A coach mark rides along while the page scrolls", async () => {
  render(<Spotlight tall />);

  await expect.element(page.getByTestId("hint")).toBeInTheDocument();
  const offsetBeforeScroll = offsetToAnchor();
  expect(offsetBeforeScroll).not.toBeNull();

  window.scrollTo(0, 500);
  await expect.poll(() => window.scrollY).toBe(500);

  // Asserting that nothing happened needs a settle window: a close would be a
  // state update, so a bare `toBeInTheDocument()` passes before it lands.
  await new Promise((resolve) => setTimeout(resolve, 400));

  await expect.element(page.getByTestId("hint")).toBeInTheDocument();
  expect(offsetToAnchor()).toBe(offsetBeforeScroll);

  window.scrollTo(0, 0);
});

test("A coach mark finds its anchor by id", async () => {
  render(
    <div>
      <button id="anchor-by-id" data-testid="anchor">
        Anchor
      </button>
      <CoachMark anchor="anchor-by-id" defaultOpen>
        <Text data-testid="hint">This button now does more.</Text>
      </CoachMark>
    </div>,
  );

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  // Positioned against the anchor, not parked at the origin.
  const anchor = document.querySelector("[data-testid='anchor']");
  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;
  const anchorBottom = anchor?.getBoundingClientRect().bottom ?? 0;
  const popoverTop = popover?.getBoundingClientRect().top ?? 0;

  expect(popoverTop).toBeGreaterThan(anchorBottom - 1);
  expect(document.getElementById("anchor-by-id")).toHaveAttribute(
    "aria-details",
  );
});

/*
 * Open from the very first render, which is how a coach mark is normally
 * written. Nothing re-renders between mount and open, so the anchor's ref is
 * still empty while the popover first renders — the case that has to keep
 * working, because reading the anchor a moment too early silently leaves it
 * unobserved.
 */
const Progressive = (props: { anchorById?: boolean }) => {
  const [hasBanner, setHasBanner] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController("CoachMark", {
    isDefaultOpen: true,
  });

  return (
    <div>
      {/* Stands in for content that arrives late — over a remote connection the
          host fills the page in piece by piece, and whatever lands above the
          anchor moves it after the coach mark already placed itself. */}
      {hasBanner && <div style={{ height: "200px" }}>Loaded later</div>}
      <button id="moving-anchor" ref={anchor} data-testid="anchor">
        Anchor
      </button>
      <CoachMark
        anchorRef={props.anchorById ? undefined : anchor}
        anchor={props.anchorById ? "moving-anchor" : undefined}
        controller={controller}
      >
        <Text data-testid="hint">This button now does more.</Text>
      </CoachMark>
      {/* Far below, so the coach mark never covers it. */}
      <div style={{ marginBlockStart: "400px" }}>
        <button data-testid="grow" onClick={() => setHasBanner(true)}>
          Grow
        </button>
      </div>
    </div>
  );
};

test.for([
  ["by ref", false],
  ["by id", true],
] as const)(
  "A coach mark anchored %s follows its anchor when the page pushes it down",
  async ([, anchorById]) => {
    render(<Progressive anchorById={anchorById} />);

    const hint = page.getByTestId("hint");
    await expect.element(hint).toBeInTheDocument();

    // Measured from this render's own popover — the whole document holds the
    // other case's leftovers too, and picking the first match compares a
    // popover to somebody else's anchor.
    const popover = hint
      .element()
      .closest("[class*='flow--popover--content']")?.parentElement;
    const anchor = popover?.previousElementSibling;
    const offset = () =>
      popover && anchor
        ? Math.round(
            popover.getBoundingClientRect().top -
              anchor.getBoundingClientRect().top,
          )
        : null;

    // An anchor given by id is resolved after the commit, so the popover is
    // briefly unpositioned. Take the baseline once it has been placed.
    await expect
      .poll(() => popover?.style.top || popover?.style.bottom)
      .toBeTruthy();

    const offsetBefore = offset();
    expect(offsetBefore).not.toBeNull();

    await page.getByTestId("grow").click();
    await expect.element(page.getByText("Loaded later")).toBeInTheDocument();

    await expect.poll(offset).toBe(offsetBefore);
  },
);

test.for(["top", "bottom"] as const)(
  "The tip sits on the edge facing the anchor when placed %s",
  async (placement) => {
    render(
      <div style={{ paddingBlock: "300px" }}>
        <button id="tip-anchor" data-testid="anchor">
          Anchor
        </button>
        <CoachMark anchor="tip-anchor" placement={placement} defaultOpen>
          <Text data-testid="hint">This button now does more.</Text>
        </CoachMark>
      </div>,
    );

    const hint = page.getByTestId("hint");
    await expect.element(hint).toBeInTheDocument();

    const popover = hint
      .element()
      .closest("[class*='flow--popover--content']")?.parentElement;
    const tip = popover?.querySelector("[class*='tip']");

    await expect.poll(() => popover?.dataset.placement).toBe(placement);

    // Placed above the anchor the tip belongs at the popover's bottom edge, and
    // the other way round — never floating on the side the anchor is not on.
    const popoverBox = popover?.getBoundingClientRect();
    const tipBox = tip?.getBoundingClientRect();
    const distanceToEdge =
      popoverBox && tipBox
        ? placement === "top"
          ? Math.abs(tipBox.top - popoverBox.bottom)
          : Math.abs(tipBox.bottom - popoverBox.top)
        : null;

    expect(distanceToEdge).toBeLessThan(2);
  },
);

test("A coach mark without any anchor renders nothing", async () => {
  render(
    <CoachMark defaultOpen>
      <Text data-testid="hint">Nowhere to point.</Text>
    </CoachMark>,
  );

  await expect.element(page.getByTestId("hint")).not.toBeInTheDocument();
});
