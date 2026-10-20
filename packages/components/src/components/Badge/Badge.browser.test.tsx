import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
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
import { Label } from "@/components/Label";

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

/*
 * The HTML parser closes a <p> at the first block element it meets, so a badge
 * in running text that renders one leaves the server markup out of step with
 * the tree React hydrates.
 */
const parseInParagraph = (element: ReactElement) =>
  new DOMParser().parseFromString(
    `<p>${renderToString(element)}</p>`,
    "text/html",
  ).body;

test.each([
  { variant: "with a value", badge: <Badge>Value</Badge> },
  {
    variant: "with a scope",
    badge: (
      <Badge>
        <Label>Scope</Label>
        <Text>Value</Text>
      </Badge>
    ),
  },
  {
    variant: "that can be pressed",
    badge: <Badge onPress={() => undefined}>Value</Badge>,
  },
  {
    variant: "that can be closed",
    badge: <Badge onClose={() => undefined}>Value</Badge>,
  },
  {
    variant: "with a contextual help",
    badge: (
      <Badge>
        Value
        <ContextualHelp>
          <Text>Every value has a story to tell.</Text>
        </ContextualHelp>
      </Badge>
    ),
  },
])(
  "A badge $variant stays inside the paragraph it is placed in",
  ({ badge }) => {
    expect(parseInParagraph(badge).children).toHaveLength(1);
  },
);
