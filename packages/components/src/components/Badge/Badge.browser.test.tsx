import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Badge } from "@/components/Badge";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";
import { Label } from "@/components/Label";
import { hydrateServerMarkup } from "@/lib/dev/hydrateServerMarkup";

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

test.each([
  ["violet", "lilac"],
  ["teal", "sage"],
  ["green", "success"],
  ["orange", "warning"],
  ["red", "danger"],
] as const)(
  "the deprecated color '%s' renders as '%s' and warns",
  async (color, replacement) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Badge color={color} data-testid="badge">
          Value
        </Badge>
      </DeprecationWarningProvider>,
    );

    await expect
      .element(page.getByTestId("badge"))
      .toHaveClass(`flow--badge--${replacement}`);
    expect(onWarning).toHaveBeenCalledWith(
      `The color '${color}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
    );
  },
);

test("the color 'sage' does not warn", async () => {
  const onWarning = vi.fn();

  await render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <Badge color="sage" data-testid="badge">
        Value
      </Badge>
    </DeprecationWarningProvider>,
  );

  await expect
    .element(page.getByTestId("badge"))
    .toHaveClass("flow--badge--sage");
  expect(onWarning).not.toHaveBeenCalled();
});

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
  "A server-rendered badge $variant hydrates in a paragraph",
  async ({ badge }) => {
    expect(await hydrateServerMarkup(<p>{badge}</p>)).toEqual([]);
  },
);
