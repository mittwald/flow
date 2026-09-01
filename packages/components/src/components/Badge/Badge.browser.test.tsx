import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Text } from "@/components/Text";
import { Action } from "@/components/Action";
import { CopyButton } from "@/components/CopyButton";
import { Content } from "@/components/Content";
import { Modal, ModalTrigger } from "@/components/Modal";
import { IconInfo } from "@/components/Icon/components/icons";

const badgeOf = (container: Element): Element => {
  const badge = container.querySelector("[data-testid='badge']");
  expect(badge).not.toBeNull();
  return badge as Element;
};

test("A button in the content is placed at the end of the badge", async () => {
  const screen = await render(
    <Badge data-testid="badge">
      Value
      <Button aria-label="More information" />
    </Badge>,
  );

  const badge = badgeOf(screen.container);
  const button = screen
    .getByRole("button", { name: "More information" })
    .element();

  expect(button.parentElement).toBe(badge);
  expect(badge.lastElementChild).toBe(button);
});

test("The close button is placed after a button in the content", async () => {
  const screen = await render(
    <Badge data-testid="badge" onClose={() => undefined}>
      Value
      <Button aria-label="More information" />
    </Badge>,
  );

  const badge = badgeOf(screen.container);
  const button = screen
    .getByRole("button", { name: "More information" })
    .element();
  const closeButton = screen.getByRole("button", { name: "Remove" }).element();

  expect(Array.from(badge.children).indexOf(button)).toBe(
    Array.from(badge.children).indexOf(closeButton) - 1,
  );
  expect(badge.lastElementChild).toBe(closeButton);
});

test("A contextual help trigger in the content opens its overlay", async () => {
  await render(
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

  await page
    .getByRole("button", { name: "More information about the value" })
    .click();

  await expect
    .element(page.getByText("Every value has a story to tell."))
    .toBeInTheDocument();
});

test("A button in the content is shaped like the close button", async () => {
  const screen = await render(
    <Badge onClose={() => undefined}>
      Value
      <Button aria-label="More information">
        <IconInfo />
      </Button>
    </Badge>,
  );

  const button = screen
    .getByRole("button", { name: "More information" })
    .element()
    .getBoundingClientRect();
  const closeButton = screen
    .getByRole("button", { name: "Remove" })
    .element()
    .getBoundingClientRect();

  expect(button.width).toBe(closeButton.width);
  expect(button.height).toBe(closeButton.height);
  expect(button.top).toBe(closeButton.top);
  expect(button.right).toBe(closeButton.left);
});

test("A copy button in the content is placed before the close button", async () => {
  const screen = await render(
    <Badge data-testid="badge" onClose={() => undefined}>
      Value
      <CopyButton text="Value" />
    </Badge>,
  );

  const badge = badgeOf(screen.container);
  const copyButton = screen.getByRole("button", { name: "Copy" }).element();
  const closeButton = screen.getByRole("button", { name: "Remove" }).element();

  expect(copyButton.parentElement).toBe(badge);
  expect(closeButton.previousElementSibling).toBe(copyButton);
});

test("An action in the content keeps its button working", async () => {
  const onAction = vi.fn();

  const screen = await render(
    <Badge data-testid="badge">
      Value
      <Action onAction={onAction}>
        <Button aria-label="Refresh" />
      </Action>
    </Badge>,
  );

  const badge = badgeOf(screen.container);
  const button = screen.getByRole("button", { name: "Refresh" }).element();

  expect(button.parentElement).toBe(badge);

  await screen.getByRole("button", { name: "Refresh" }).click();

  await expect.poll(() => onAction).toHaveBeenCalledOnce();
});

test("A modal trigger in the content opens its modal", async () => {
  await render(
    <Badge>
      Value
      <ModalTrigger>
        <Button aria-label="Details" />
        <Modal>
          <Content>Modal content</Content>
        </Modal>
      </ModalTrigger>
    </Badge>,
  );

  await page.getByRole("button", { name: "Details" }).click();

  await expect.element(page.getByText("Modal content")).toBeInTheDocument();
});
