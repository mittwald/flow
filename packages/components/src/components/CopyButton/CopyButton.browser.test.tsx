import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import copy from "copy-to-clipboard";
import { CopyButton } from "@/components/CopyButton";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn() }));

const button = () => page.getByRole("button", { name: "Copy" });

test("pressing the button copies the text", async () => {
  vi.mocked(copy).mockClear();

  render(<CopyButton text="ssh://rebelbase.org" />);

  await button().click();

  expect(copy).toHaveBeenCalledWith("ssh://rebelbase.org");
});

// Without `text` there is nothing to copy — the button must not copy the label.
test("a button without text copies an empty string", async () => {
  vi.mocked(copy).mockClear();

  render(<CopyButton />);

  await button().click();

  expect(copy).toHaveBeenCalledWith("");
});

test("the button is labelled and describes itself through its tooltip", async () => {
  render(<CopyButton text="ssh://rebelbase.org" />);

  await userEvent.tab();

  await expect.element(page.getByRole("tooltip")).toHaveTextContent("Copy");
  await expect.element(button()).toHaveAccessibleName("Copy");
});

test("a disabled button does not copy", async () => {
  vi.mocked(copy).mockClear();

  render(<CopyButton text="ssh://rebelbase.org" isDisabled />);

  await expect.element(button()).toBeDisabled();

  await button().click({ force: true });

  expect(copy).not.toHaveBeenCalled();
});
