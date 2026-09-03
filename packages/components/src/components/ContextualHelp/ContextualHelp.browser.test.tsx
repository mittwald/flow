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
