import CodeEditor from "@/components/CodeEditor";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import { render } from "vitest-browser-react";

test("CodeEditor renders the label outside of the editor", async () => {
  const dom = await render(
    <CodeEditor value="const jedi = true;">
      <Label>Source code</Label>
    </CodeEditor>,
  );

  const label = dom.getByText("Source code").element();
  const editor = dom.getByRole("textbox").element();

  expect(editor.contains(label)).toBe(false);
  expect(editor).toHaveAccessibleName(expect.stringContaining("Source code"));
});

test("CodeEditor can be named with an aria-label instead", async () => {
  const dom = await render(
    <CodeEditor value="const jedi = true;" aria-label="Source code" />,
  );

  await expect
    .element(dom.getByRole("textbox"))
    .toHaveAccessibleName("Source code");
});

test("CodeEditor is described by its field description", async () => {
  const dom = await render(
    <CodeEditor value="const jedi = true;">
      <Label>Source code</Label>
      <FieldDescription>Must be valid TypeScript</FieldDescription>
    </CodeEditor>,
  );

  await expect
    .element(dom.getByRole("textbox"))
    .toHaveAccessibleDescription("Must be valid TypeScript");
});

test("CodeEditor is marked and styled as invalid", async () => {
  const dom = await render(
    <CodeEditor value="const jedi = ;" isInvalid>
      <Label>Source code</Label>
      <FieldError>Invalid TypeScript</FieldError>
    </CodeEditor>,
  );

  const editor = dom.getByRole("textbox").element();

  expect(editor).toHaveAttribute("aria-invalid", "true");
  expect(editor).toHaveAccessibleDescription(
    expect.stringContaining("Invalid TypeScript"),
  );
  expect(editor.closest("[data-invalid]")).not.toBeNull();
});

/*
 * Label and description are optional and tunnelled out of the editor. It
 * references them only while they are rendered – a dangling id fails HTML
 * validators and a11y checks.
 */
test("CodeEditor references only the label and description it renders", async () => {
  const Editor = (props: {
    withLabel?: boolean;
    withDescription?: boolean;
  }) => (
    <CodeEditor value="const jedi = true;" aria-label="Source code">
      {props.withLabel && <Label>Source code</Label>}
      {props.withDescription && (
        <FieldDescription>Must be valid TypeScript</FieldDescription>
      )}
    </CodeEditor>
  );
  const dom = await render(<Editor />);
  const editor = dom.getByRole("textbox");

  await expect.element(editor).toHaveAccessibleName("Source code");
  await expect.element(editor).not.toHaveAttribute("aria-labelledby");
  await expect.element(editor).not.toHaveAttribute("aria-describedby");

  await dom.rerender(<Editor withLabel withDescription />);

  await expect
    .element(editor)
    .toHaveAccessibleDescription("Must be valid TypeScript");
  await expect.element(editor).toHaveAttribute("aria-labelledby");

  await dom.rerender(<Editor />);

  await expect.element(editor).not.toHaveAttribute("aria-labelledby");
  await expect.element(editor).not.toHaveAttribute("aria-describedby");
});
