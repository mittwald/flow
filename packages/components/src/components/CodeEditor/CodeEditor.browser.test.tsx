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

/*
 * CodeMirror injects its styles unlayered, so they win over the layered
 * stylesheet of Flow regardless of specificity. Colors that the editor theme
 * leaves out therefore stay at CodeMirror's hard-coded light-mode values –
 * unreadable in dark mode.
 */
test("CodeEditor takes the highlight of the active line from the editor theme", async () => {
  await render(
    <CodeEditor value="const jedi = true;" aria-label="Source code" />,
  );

  const activeLineGutterRules = [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
    .filter(
      (rule) =>
        rule.selectorText.endsWith(".cm-activeLineGutter") &&
        !rule.selectorText.includes("flow--"),
    );

  expect(
    activeLineGutterRules.map((rule) => rule.style.backgroundColor),
  ).toContainEqual(
    expect.stringContaining("--form-control--background-color--hover"),
  );
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
