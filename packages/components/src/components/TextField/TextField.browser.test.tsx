import TextArea from "@/components/TextArea";
import TextField from "@/components/TextField/index";
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

test("TextArea has typed value on blur", async () => {
  const dom = await render(<TextArea aria-label="test" />);
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "test");
  expect(input).toHaveDisplayValue("test");
  await userEvent.tab();
  expect(input).toHaveDisplayValue("test");
});
