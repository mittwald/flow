import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Badge } from "@/components/Badge";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";

test("A contextual help in the content opens from a button of its own", async () => {
  await render(
    <Badge>
      Value
      <ContextualHelp>
        <Text>Every value has a story to tell.</Text>
      </ContextualHelp>
    </Badge>,
  );

  await expect
    .element(page.getByText("Every value has a story to tell."))
    .not.toBeInTheDocument();

  await page.getByRole("button", { name: "More information" }).click();

  await expect
    .element(page.getByText("Every value has a story to tell."))
    .toBeInTheDocument();
});

test("A disabled badge disables the contextual help button", async () => {
  const screen = await render(
    <Badge isDisabled>
      Value
      <ContextualHelp>
        <Text>Every value has a story to tell.</Text>
      </ContextualHelp>
    </Badge>,
  );

  await expect
    .element(screen.getByRole("button", { name: "More information" }))
    .toBeDisabled();
});

test("A contextual help trigger in the content places a single button", async () => {
  const screen = await render(
    <Badge>
      Value
      <ContextualHelpTrigger subject="the value">
        <Button />
        <ContextualHelp>
          <Text>Every value has a story to tell.</Text>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Badge>,
  );

  await expect.element(screen.getByRole("button")).toBeInTheDocument();

  await screen
    .getByRole("button", { name: "More information about the value" })
    .click();

  await expect
    .element(page.getByText("Every value has a story to tell."))
    .toBeInTheDocument();
});
