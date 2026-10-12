import TextArea from "@/components/TextArea";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { useState } from "react";

test("TextArea has typed value on blur", async () => {
  const dom = await render(<TextArea aria-label="test" />);
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "test");
  expect(input).toHaveDisplayValue("test");
  await userEvent.tab();
  expect(input).toHaveDisplayValue("test");
});

const draftText = "Alderaan\nis\npeaceful\nwe\nhave\nno\nweapons";

const autoResizeProps = {
  rows: 1,
  autoResizeMaxRows: 8,
} as const;

test("auto resizing text area fits an initial value", async () => {
  const dom = await render(
    <>
      <TextArea {...autoResizeProps} aria-label="Empty" />
      <TextArea
        {...autoResizeProps}
        aria-label="Draft"
        defaultValue={draftText}
      />
    </>,
  );

  const empty = dom.getByRole("textbox", { name: "Empty" }).element();
  const withDraft = dom.getByRole("textbox", { name: "Draft" }).element();

  expect(withDraft.clientHeight).toBeGreaterThan(empty.clientHeight);
});

test("auto resizing text area fits a value set from the outside", async () => {
  const Draft = () => {
    const [value, setValue] = useState("");
    return (
      <>
        <TextArea
          {...autoResizeProps}
          aria-label="Draft"
          value={value}
          onChange={setValue}
        />
        <button onClick={() => setValue(draftText)}>Load draft</button>
      </>
    );
  };

  const dom = await render(<Draft />);
  const input = dom.getByRole("textbox").element();
  const emptyHeight = input.clientHeight;

  await userEvent.click(dom.getByRole("button", { name: "Load draft" }));

  await expect.poll(() => input.clientHeight).toBeGreaterThan(emptyHeight);
});

test("character count reflects a value set from the outside", async () => {
  const Draft = () => {
    const [value, setValue] = useState("");
    return (
      <>
        <TextArea
          aria-label="test"
          showCharacterCount
          maxLength={100}
          value={value}
          onChange={setValue}
        />
        <button onClick={() => setValue("Alderaan")}>Load draft</button>
      </>
    );
  };

  const dom = await render(<Draft />);
  await expect.element(dom.getByText("0/100 characters")).toBeInTheDocument();

  await userEvent.click(dom.getByRole("button", { name: "Load draft" }));

  await expect.element(dom.getByText("8/100 characters")).toBeInTheDocument();
});

test("character count counts typed characters", async () => {
  const dom = await render(
    <TextArea aria-label="test" showCharacterCount maxLength={100} />,
  );

  await userEvent.type(dom.getByRole("textbox"), "Alderaan");

  await expect.element(dom.getByText("8/100 characters")).toBeInTheDocument();
});
