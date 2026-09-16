import { useRef } from "react";
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

test("A coach mark without any anchor renders nothing", async () => {
  render(
    <CoachMark defaultOpen>
      <Text data-testid="hint">Nowhere to point.</Text>
    </CoachMark>,
  );

  await expect.element(page.getByTestId("hint")).not.toBeInTheDocument();
});
