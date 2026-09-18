import { useRef, useState } from "react";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { Action } from "@/components/Action";
import { Button } from "@/components/Button";
import { CoachMark } from "@/components/CoachMark";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { useOverlayController } from "@/lib/controller";

const Spotlight = (props: { tall?: boolean }) => {
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController("CoachMark", {
    isDefaultOpen: true,
  });

  return (
    <div style={{ height: props.tall ? "4000px" : undefined }}>
      <button ref={anchor} data-testid="anchor">
        Anchor
      </button>
      <CoachMark anchorRef={anchor} controller={controller}>
        <Heading>New around here</Heading>
        <Text data-testid="hint">
          This button now does more than it used to.
        </Text>
        <Action closeOverlay="CoachMark">
          <Button>Got it</Button>
        </Action>
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

test("A composed action dismisses a coach mark", async () => {
  render(<Spotlight />);

  await expect.element(page.getByTestId("hint")).toBeInTheDocument();

  await page.getByRole("button", { name: "Got it" }).click();

  await expect.element(page.getByTestId("hint")).not.toBeInTheDocument();
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
      <CoachMark anchor="anchor-by-id" isDefaultOpen>
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
        <CoachMark anchor="tip-anchor" placement={placement} isDefaultOpen>
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

test("A coach mark stays behind app chrome that claims a stacking level", async () => {
  render(
    <div style={{ height: "3000px" }}>
      {/* A sticky header, the way an application frames its pages. */}
      <div
        data-testid="chrome"
        style={{
          position: "sticky",
          insetBlockStart: 0,
          zIndex: 1,
          height: "80px",
          background: "black",
        }}
      />
      <div style={{ paddingBlockStart: "600px" }}>
        <button id="chrome-anchor" data-testid="anchor">
          Anchor
        </button>
        <CoachMark anchor="chrome-anchor" placement="top" isDefaultOpen>
          <Text data-testid="hint">This button now does more.</Text>
        </CoachMark>
      </div>
    </div>,
  );

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;

  // react-aria hands a portalled overlay `z-index: 100000`, which would put this
  // one in front of the whole application. It renders in place, so it claims no
  // stacking level and the header keeps its place above it.
  expect(popover && getComputedStyle(popover).zIndex).toBe("auto");

  // Scroll until the coach mark passes through the sticky header, then ask the
  // document which of the two is actually painted there.
  const chrome = page.getByTestId("chrome").element();
  const popoverTop =
    (popover?.getBoundingClientRect().top ?? 0) + window.scrollY;
  window.scrollTo(0, popoverTop - 40);
  await expect.poll(() => window.scrollY).toBeGreaterThan(0);

  const chromeBox = chrome.getBoundingClientRect();
  const painted = document.elementFromPoint(
    Math.round(chromeBox.x + chromeBox.width / 2),
    Math.round(chromeBox.bottom - 5),
  );

  expect(popover?.contains(painted)).toBe(false);
  expect(painted).toBe(chrome);

  window.scrollTo(0, 0);
});

test("A coach mark below the fold is not squashed to nothing", async () => {
  render(
    <div>
      {/* The anchor starts far below the viewport, the way a hint halfway down
          a long page does. react-aria caps an overlay at the room left in the
          viewport, which is none — and page scrolling never recomputes it. */}
      <div style={{ height: "3000px" }} />
      <button id="far-anchor" data-testid="anchor">
        Anchor
      </button>
      <CoachMark anchor="far-anchor" isDefaultOpen>
        <Heading>New around here</Heading>
        <Text data-testid="hint">
          This button now does more than it used to.
        </Text>
      </CoachMark>
      <div style={{ height: "3000px" }} />
    </div>,
  );

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;

  await expect
    .poll(() => Math.round(popover?.getBoundingClientRect().height ?? 0))
    .toBeGreaterThan(40);
  expect(popover && getComputedStyle(popover).maxHeight).toBe("none");
});

test("A coach mark without an anchor stays in the DOM, out of sight", async () => {
  render(
    <CoachMark isDefaultOpen>
      <Text data-testid="hint">Nowhere to point.</Text>
    </CoachMark>,
  );

  /*
   * It renders — there is nothing to position against yet, so it waits where it
   * stands rather than unmounting. `visibility: hidden` keeps it off the screen
   * and out of the accessibility tree until an anchor turns up.
   */
  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;

  expect(popover?.style.visibility).toBe("hidden");
  expect(popover?.dataset.placement).toBeUndefined();
});

test("A coach mark finds an anchor that mounts after it", async () => {
  const LateAnchor = () => {
    const [isMounted, setIsMounted] = useState(false);

    return (
      <div>
        {isMounted && (
          <button id="late-anchor" data-testid="anchor">
            Anchor
          </button>
        )}
        <CoachMark anchor="late-anchor" isDefaultOpen>
          <Text data-testid="hint">This button now does more.</Text>
        </CoachMark>
        {/* Stands in for the host materializing the page in pieces. */}
        <button data-testid="mount" onClick={() => setIsMounted(true)}>
          Mount the anchor
        </button>
      </div>
    );
  };

  render(<LateAnchor />);

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;
  expect(popover?.style.visibility).toBe("hidden");

  await page.getByTestId("mount").click();

  await expect.poll(() => popover?.dataset.placement).toBeTruthy();
  expect(popover?.style.visibility).toBe("");
  expect(document.getElementById("late-anchor")).toHaveAttribute(
    "aria-details",
  );
});

test("A coach mark forwards DOM props on its non-modal path", async () => {
  render(
    <div>
      <button id="dom-props-anchor" data-testid="anchor">
        Anchor
      </button>
      <CoachMark
        anchor="dom-props-anchor"
        isDefaultOpen
        aria-label="A hint"
        lang="en"
      >
        <Text data-testid="hint">This button now does more.</Text>
      </CoachMark>
    </div>,
  );

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  /*
   * `Aria.Popover` forwards these on the modal path. Here the props are named
   * one by one, so anything the positioning does not claim has to reach the
   * element rather than disappear into the hook.
   */
  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;

  expect(popover).toHaveAttribute("aria-label", "A hint");
  expect(popover).toHaveAttribute("lang", "en");
});
