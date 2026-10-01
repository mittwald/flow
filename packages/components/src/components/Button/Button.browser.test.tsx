import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Button } from "@/components/Button";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

test("the deprecated color 'accent' still renders as 'success' and warns", async () => {
  const onWarning = vi.fn();

  await render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <Button color="accent">Save</Button>
    </DeprecationWarningProvider>,
  );

  const button = page.getByRole("button", { name: "Save" });
  await expect.element(button).toHaveClass("flow--button--success");
  // eslint-disable-next-line flow/no-unknown-flow-class -- asserts the removed class stays gone
  await expect.element(button).not.toHaveClass("flow--button--accent");
  expect(onWarning).toHaveBeenCalledWith(
    "The color 'accent' is deprecated and will be removed in a future release. Use 'success' instead.",
  );
});

test("the color 'success' does not warn", async () => {
  const onWarning = vi.fn();

  await render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <Button color="success">Save</Button>
    </DeprecationWarningProvider>,
  );

  const button = page.getByRole("button", { name: "Save" });
  await expect.element(button).toHaveClass("flow--button--success");
  expect(onWarning).not.toHaveBeenCalled();
});

const pressAndGetTransform = async (props: Record<string, unknown>) => {
  await render(<Button {...props}>Save</Button>);
  const button = page.getByRole("button", { name: "Save" }).element();
  if (!(button instanceof HTMLElement)) {
    throw new Error("Button not found");
  }
  button.style.transition = "none";
  button.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      isPrimary: true,
    }),
  );
  await expect.element(button).toHaveAttribute("data-pressed", "true");
  return getComputedStyle(button).transform;
};

test("a pressed button scales down", async () => {
  expect(await pressAndGetTransform({})).not.toBe("none");
});

test.each([
  "isPending",
  "isSucceeded",
  "isFailed",
  "aria-disabled",
  "isReadOnly",
])("a pressed button marked %s does not scale down", async (state) => {
  expect(await pressAndGetTransform({ [state]: true })).toBe("none");
});
