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

const badgeOf = (container: Element): Element => {
  const badge = container.querySelector("[data-testid='badge']");
  expect(badge).not.toBeNull();
  return badge as Element;
};

test("A button in the content is moved out of the content", async () => {
  const screen = await render(
    <Badge data-testid="badge">
      Value
      <Button aria-label="More information" />
    </Badge>,
  );

  const button = screen
    .getByRole("button", { name: "More information" })
    .element();

  expect(button.parentElement).toBe(badgeOf(screen.container));
});

test("A copy button in the content is moved out of the content", async () => {
  const screen = await render(
    <Badge data-testid="badge">
      Value
      <CopyButton text="Value" />
    </Badge>,
  );

  const copyButton = screen.getByRole("button", { name: "Copy" }).element();

  expect(copyButton.parentElement).toBe(badgeOf(screen.container));
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

test("An action in the content keeps its button working", async () => {
  const onAction = vi.fn();

  const screen = await render(
    <Badge>
      Value
      <Action onAction={onAction}>
        <Button aria-label="Refresh" />
      </Action>
    </Badge>,
  );

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
