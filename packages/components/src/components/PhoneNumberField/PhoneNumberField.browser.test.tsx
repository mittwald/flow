import PhoneNumberField from "@/components/PhoneNumberField";
import { useState } from "react";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

test("emits E.164 for a national number entered with spaces", async () => {
  const onChange = vi.fn();
  const dom = await render(
    <PhoneNumberField aria-label="Phone" onChange={onChange} />,
  );
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "05772 293100");
  expect(onChange).toHaveBeenLastCalledWith("+495772293100");
});

test("emits E.164 for a national number entered without spaces", async () => {
  const onChange = vi.fn();
  const dom = await render(
    <PhoneNumberField aria-label="Phone" onChange={onChange} />,
  );
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "05772293100");
  expect(onChange).toHaveBeenLastCalledWith("+495772293100");
});

test("detects the country from a + prefix regardless of defaultCountry", async () => {
  const onChange = vi.fn();
  const dom = await render(
    <PhoneNumberField aria-label="Phone" onChange={onChange} />,
  );
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "+31 6 12345678");
  expect(onChange).toHaveBeenLastCalledWith("+31612345678");
});

test("applies defaultCountry to national numbers", async () => {
  const onChange = vi.fn();
  const dom = await render(
    <PhoneNumberField
      aria-label="Phone"
      defaultCountry="AT"
      onChange={onChange}
    />,
  );
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "0664 1234567");
  expect(onChange).toHaveBeenLastCalledWith("+436641234567");
});

test("formats the display value on blur", async () => {
  const dom = await render(<PhoneNumberField aria-label="Phone" />);
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "05772293100");
  await userEvent.tab();
  expect(input).toHaveDisplayValue("+49 5772 293100");
});

test("keeps unparseable input untouched", async () => {
  const onChange = vi.fn();
  const dom = await render(
    <PhoneNumberField aria-label="Phone" onChange={onChange} />,
  );
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "hello");
  expect(onChange).toHaveBeenLastCalledWith("hello");
  await userEvent.tab();
  expect(input).toHaveDisplayValue("hello");
});

test("formats a controlled E.164 value for display", async () => {
  const TestComponent = () => {
    const [value, setValue] = useState("+495772293100");
    return (
      <PhoneNumberField aria-label="Phone" value={value} onChange={setValue} />
    );
  };
  const dom = await render(<TestComponent />);
  const input = dom.getByRole("textbox");
  expect(input).toHaveDisplayValue("+49 5772 293100");
});
