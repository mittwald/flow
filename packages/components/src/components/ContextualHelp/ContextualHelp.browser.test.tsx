import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";

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

test("A width reaches the content, past the contextual help's own cap", async () => {
  render(
    <ContextualHelpTrigger>
      <Button />
      {/* Wider than `--contextual-help--max-width` (500px), which caps the
          content of a contextual help nobody sized. */}
      <ContextualHelp width={700}>
        <Text data-testid="help">Each user profile is assigned a role.</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>,
  );

  await page.getByRole("button").click();

  const help = page.getByTestId("help");
  await expect.element(help).toBeInTheDocument();

  const content = help.element().closest("[class*='flow--contextual-help']");
  const popover = content?.parentElement?.parentElement;

  expect(popover?.getBoundingClientRect().width).toBe(700);
  // The content fills the popover's inner box — `clientWidth` leaves out the
  // border the width is measured over.
  expect(content?.getBoundingClientRect().width).toBe(popover?.clientWidth);
});
