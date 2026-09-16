import { useRef } from "react";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { useOverlayController } from "@/lib/controller";

test("Contextual help content does not add heading structure", async () => {
  render(
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp>
        <Heading>Rights & roles</Heading>
        <Text>Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  await page.getByRole("button").click();

  await expect.element(page.getByText("Rights & roles")).toBeInTheDocument();
  await expect.element(page.getByRole("heading")).not.toBeInTheDocument();
});

test("Trigger uses a descriptive aria label", async () => {
  render(
    <ContextualHelpTrigger subject="rights & roles">
      <Button />
      <ContextualHelp>
        <Text>Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  await expect
    .element(
      page.getByRole("button", {
        name: "More information about rights & roles",
      }),
    )
    .toBeInTheDocument();
});

test("An aria label on the trigger replaces the label built from the subject", async () => {
  render(
    <ContextualHelpTrigger subject="rights & roles" aria-label="Custom label">
      <Button />
      <ContextualHelp>
        <Text>Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  await expect
    .element(page.getByRole("button"))
    .toHaveAttribute("aria-label", "Custom label");
});

test("An aria label on the button still wins over the trigger", async () => {
  render(
    <ContextualHelpTrigger subject="rights & roles" aria-label="From trigger">
      <Button aria-label="From button" />
      <ContextualHelp>
        <Text>Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  await expect
    .element(page.getByRole("button"))
    .toHaveAttribute("aria-label", "From button");
});

test("A modal contextual help is a dialog and blocks page scrolling", async () => {
  render(
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp>
        <Text>Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  await page.getByRole("button").click();

  await expect.element(page.getByRole("dialog")).toBeInTheDocument();
  expect(document.documentElement.style.overflow).toBe("hidden");
});

test("A non-modal contextual help is plain content and leaves the page alone", async () => {
  render(
    <ContextualHelpTrigger>
      <Button data-testid="trigger" />
      <ContextualHelp modality="non-modal">
        <Text>Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  const trigger = page.getByTestId("trigger");
  await trigger.click();

  await expect
    .element(page.getByText("Each user profile is assigned a role."))
    .toBeInTheDocument();
  await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
  expect(document.documentElement.style.overflow).toBe("");
});

test("The deprecated isNonModal does what modality='non-modal' does", async () => {
  render(
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp isNonModal>
        <Text>Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  await page.getByRole("button").click();

  await expect
    .element(page.getByText("Each user profile is assigned a role."))
    .toBeInTheDocument();
  await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  expect(document.documentElement.style.overflow).toBe("");
});

// The mStudio feature spotlight: an anchored hint that opens on mount, on a
// page the user is meant to keep reading.
const Spotlight = (props: { modality?: "modal" | "non-modal" }) => {
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController("ContextualHelp", {
    isDefaultOpen: true,
  });

  return (
    <div style={{ height: "4000px" }}>
      <button ref={anchor} data-testid="anchor">
        Anchor
      </button>
      <ContextualHelp
        controller={controller}
        triggerRef={anchor}
        modality={props.modality}
      >
        <Text data-testid="hint">
          This button now does more than it used to.
        </Text>
      </ContextualHelp>
    </div>
  );
};

const offsetToAnchor = () => {
  const anchor = document.querySelector("[data-testid='anchor']");
  const hint = document
    .querySelector("[data-testid='hint']")
    ?.closest("[class*='flow--popover']");
  if (!anchor || !hint) {
    return null;
  }
  return Math.round(
    hint.getBoundingClientRect().top - anchor.getBoundingClientRect().top,
  );
};

test("A non-modal contextual help rides along while the page scrolls", async () => {
  render(<Spotlight modality="non-modal" />);

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

test("A modal contextual help cannot be scrolled away from", async () => {
  render(<Spotlight />);

  await expect.element(page.getByTestId("hint")).toBeInTheDocument();
  expect(document.documentElement.style.overflow).toBe("hidden");
});

test("A non-modal contextual help is rendered where it was written, not at the end of the body", async () => {
  render(<Spotlight modality="non-modal" />);

  const hint = page.getByTestId("hint");
  await expect.element(hint).toBeInTheDocument();

  const anchor = document.querySelector("[data-testid='anchor']");
  const popover = hint
    .element()
    .closest("[class*='flow--popover--content']")?.parentElement;

  // Right after its anchor in reading order — a portal to the body would put
  // the hint behind the whole page for anyone reading sequentially.
  expect(anchor).not.toBeNull();
  expect(popover).not.toBeUndefined();
  expect(anchor?.parentElement).toBe(popover?.parentElement);
  expect(popover && anchor?.compareDocumentPosition(popover)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});
