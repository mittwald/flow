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
