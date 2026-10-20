import CodeEditor from "@/components/CodeEditor";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import { render } from "vitest-browser-react";
import { EditorView } from "@uiw/react-codemirror";
import { userEvent } from "vitest/browser";

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

test.each(["log", "constructor"])(
  "CodeEditor shows code in the unknown language %s as plain text",
  async (language) => {
    const dom = await render(
      <CodeEditor
        value="const jedi = true;"
        language={language}
        aria-label="Source code"
      />,
    );

    await expect
      .element(dom.getByRole("textbox"))
      .toHaveTextContent("const jedi = true;");
  },
);

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

test("CodeEditor can be disabled", async () => {
  const dom = await render(
    <CodeEditor value="const jedi = true;" isDisabled>
      <Label>Source code</Label>
    </CodeEditor>,
  );

  const editor = dom.getByRole("textbox").element();

  expect(editor).toHaveAttribute("aria-disabled", "true");
  expect(editor).toHaveAttribute("contenteditable", "false");
  expect(editor.closest("[data-disabled]")).not.toBeNull();
  await expect.element(dom.getByRole("button")).toBeDisabled();
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

test("CodeEditor leaves the extensions passed to it untouched", async () => {
  const extensions = [EditorView.lineWrapping];
  const Editor = (props: { value: string }) => (
    <CodeEditor
      value={props.value}
      language="ts"
      extensions={extensions}
      aria-label="Source code"
    />
  );
  const dom = await render(<Editor value="const jedi = true;" />);
  await dom.rerender(<Editor value="const sith = false;" />);

  await expect
    .element(dom.getByRole("textbox"))
    .toHaveTextContent("const sith = false;");
  expect(extensions.length).toBe(1);
  expect(extensions[0]).toBe(EditorView.lineWrapping);
});

test("CodeEditor does not reconfigure when re-rendered with unchanged props", async () => {
  let reconfigurations = 0;
  const extensions = [
    EditorView.updateListener.of((update) => {
      reconfigurations += update.transactions.filter(
        (transaction) => transaction.reconfigured,
      ).length;
    }),
  ];
  const Editor = () => (
    <CodeEditor
      value="const jedi = true;"
      language="ts"
      extensions={extensions}
      isRequired
    >
      <Label>Source code</Label>
      <FieldDescription>Must be valid TypeScript</FieldDescription>
    </CodeEditor>
  );
  const dom = await render(<Editor />);
  const editor = dom.getByRole("textbox");
  await expect
    .element(editor)
    .toHaveAccessibleDescription("Must be valid TypeScript");
  reconfigurations = 0;

  await dom.rerender(<Editor />);
  await dom.rerender(<Editor />);

  expect(reconfigurations).toBe(0);
  await expect.element(editor).toHaveAttribute("aria-required", "true");
  await expect.element(editor).toHaveAttribute("aria-labelledby");
});

/*
 * Some extensions bring a style module along. CodeMirror never unmounts a
 * style module, so one created per render grows the document's styles.
 */
test("CodeEditor adds no styles to the document when re-rendered", async () => {
  const countCssRules = () =>
    [...document.adoptedStyleSheets, ...document.styleSheets].reduce(
      (count, sheet) => count + sheet.cssRules.length,
      0,
    );
  const Editor = () => (
    <CodeEditor
      value={"if (jedi) {\n  return true;\n}"}
      language="ts"
      extensions={[EditorView.lineWrapping]}
      aria-label="Source code"
    />
  );
  const dom = await render(<Editor />);
  await expect.element(dom.getByRole("textbox")).toBeVisible();
  const cssRules = countCssRules();

  await dom.rerender(<Editor />);
  await dom.rerender(<Editor />);

  expect(countCssRules()).toBe(cssRules);
});

test("CodeEditor reports statistics to the latest onStatistics", async () => {
  const first = vi.fn();
  const latest = vi.fn();
  const dom = await render(
    <CodeEditor aria-label="Source code" onStatistics={first} />,
  );
  await dom.rerender(
    <CodeEditor aria-label="Source code" onStatistics={latest} />,
  );
  first.mockClear();

  await userEvent.type(dom.getByRole("textbox"), "x");

  expect(latest).toHaveBeenCalled();
  expect(first).not.toHaveBeenCalled();
});
