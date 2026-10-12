import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { Notification } from "@/components/Notification";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

const closeButton = () => page.getByRole("button", { name: "Close" });

const content = (
  <>
    <Heading>Backup finished</Heading>
    <Text>Your backup is ready to download.</Text>
  </>
);

test("the notification is an alert by default", async () => {
  render(<Notification>{content}</Notification>);

  await expect
    .element(page.getByRole("alert"))
    .toHaveTextContent("Backup finished");
});

test("the role can be overridden", async () => {
  render(<Notification role="status">{content}</Notification>);

  await expect.element(page.getByRole("status")).toBeInTheDocument();
  await expect.element(page.getByRole("alert")).not.toBeInTheDocument();
});

// The close button only exists when someone is listening for it.
test("onClose adds a close button that reports the press", async () => {
  const onClose = vi.fn();

  render(<Notification onClose={onClose}>{content}</Notification>);

  await closeButton().click();

  expect(onClose).toHaveBeenCalledTimes(1);
});

test("without onClose there is no close button", async () => {
  render(<Notification>{content}</Notification>);

  await expect.element(closeButton()).not.toBeInTheDocument();
});

test("onClick makes the whole notification pressable", async () => {
  const onClick = vi.fn();

  render(<Notification onClick={onClick}>{content}</Notification>);

  await page.getByText("Backup finished").click();

  expect(onClick).toHaveBeenCalledTimes(1);
});

test("href turns the notification into a link", async () => {
  render(<Notification href="#backups">{content}</Notification>);

  await expect
    .element(page.getByRole("link"))
    .toHaveAttribute("href", "#backups");
});

/*
 * Closing is a separate action from opening whatever the notification points
 * at, so the close button must not trigger the notification's own handler.
 */
test("closing does not trigger the notification's click handler", async () => {
  const onClick = vi.fn();
  const onClose = vi.fn();

  render(
    <Notification onClick={onClick} onClose={onClose}>
      {content}
    </Notification>,
  );

  await closeButton().click();

  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onClick).not.toHaveBeenCalled();
});
