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
