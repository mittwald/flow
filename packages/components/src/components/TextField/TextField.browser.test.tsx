import TextField from "@/components/TextField";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

test("TextField has typed value on blur", async () => {
  const dom = await render(<TextField aria-label="test" />);
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "test");
  expect(input).toHaveDisplayValue("test");
  await userEvent.tab();
  expect(input).toHaveDisplayValue("test");
});

/*
 * `useControlledHostValueProps` owns the value from the first change on, so a
 * field that renders without `value` and without `defaultValue` must still
 * start out controlled – otherwise the value changes owner mid-flight, from the
 * DOM input to the hook, and react-aria warns about the transition.
 */
test("TextField stays controlled across the first change", async () => {
  const warn = vitest.spyOn(console, "warn");

  try {
    const dom = await render(<TextField aria-label="test" />);
    const input = dom.getByRole("textbox");
    await userEvent.type(input, "test");
    await expect.element(input).toHaveDisplayValue("test");

    expect(warn.mock.calls.flat().join("\n")).not.toContain(
      "uncontrolled to controlled",
    );
  } finally {
    warn.mockRestore();
  }
});
