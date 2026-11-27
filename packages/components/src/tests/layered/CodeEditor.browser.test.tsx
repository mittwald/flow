import CodeEditor from "@/components/CodeEditor";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

/**
 * Resolves a token expression to the pixel value it computes to in the given
 * element's context, so an assertion can name the token instead of hard coding
 * whatever it currently evaluates to.
 */
const resolveLength = (context: Element, value: string) => {
  const probe = document.createElement("div");
  probe.style.position = "absolute";
  probe.style.paddingInlineStart = value;
  context.append(probe);

  const resolved = getComputedStyle(probe).paddingInlineStart;
  probe.remove();

  return resolved;
};

/*
 * CodeMirror injects its theme as unlayered `<style>` elements at runtime, so
 * its declarations beat anything Flow puts in a cascade layer no matter the
 * specificity. The rules below therefore have to leave the layer — which is
 * what this suite, running against the layered stylesheet variant, proves.
 *
 * The editor is rendered invalid throughout, because the CodeMirror theme sets
 * its gutter background to the default form control token. Only a state that
 * moves the editor background away from that default tells the two apart.
 */
test("the CodeEditor gutter follows the editor background", async () => {
  const dom = await render(
    <CodeEditor
      value="const jedi = true;"
      aria-label="Source code"
      isInvalid
    />,
  );

  const codeMirror = dom
    .getByLocator(".flow--code-editor--code-mirror")
    .element();
  const gutters = dom.getByLocator(".cm-gutters").element();

  expect(getComputedStyle(gutters).backgroundColor).toBe(
    getComputedStyle(codeMirror).backgroundColor,
  );
});

test("the CodeEditor lines carry the form control padding", async () => {
  const dom = await render(
    <CodeEditor
      value="const jedi = true;"
      aria-label="Source code"
      isInvalid
    />,
  );

  const codeMirror = dom
    .getByLocator(".flow--code-editor--code-mirror")
    .element();
  const line = dom.getByLocator(".cm-line").first().element();

  expect(getComputedStyle(line).paddingInlineEnd).toBe(
    resolveLength(codeMirror, "var(--form-control--padding-x)"),
  );
  // next to the gutters, the code moves closer to the line numbers
  expect(getComputedStyle(line).paddingInlineStart).toBe(
    resolveLength(codeMirror, "var(--size-px--s)"),
  );
});

/** Resolves a color expression the way `resolveLength` resolves a length. */
const resolveColor = (context: Element, value: string) => {
  const probe = document.createElement("div");
  probe.style.color = value;
  context.append(probe);

  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved;
};

test("the CodeEditor lint markers and underlines take the severity color", async () => {
  const dom = await render(
    <CodeEditor
      language="dotEnv"
      value={"api_key=secret\napi_key=other\n"}
      aria-label="Environment"
    />,
  );

  const codeMirror = dom
    .getByLocator(".flow--code-editor--code-mirror")
    .element();
  const errorMarker = dom.getByLocator(".cm-lint-marker-error");
  const errorRange = dom.getByLocator(".cm-lintRange-error").first();

  await expect.element(errorMarker).toBeInTheDocument();

  const errorColor = resolveColor(
    codeMirror,
    "var(--code-editor--lint-color--error)",
  );

  /* CodeMirror draws the marker with `content: url(…)`, which hides any
     background — Flow masks an icon instead. */
  expect(getComputedStyle(errorMarker.element()).content).not.toContain("url(");
  expect(getComputedStyle(errorMarker.element()).backgroundColor).toBe(
    errorColor,
  );
  expect(getComputedStyle(errorRange.element()).textDecorationColor).toBe(
    errorColor,
  );
});

test("the CodeEditor lint tooltip of a gutter marker looks like a ContextualHelp", async () => {
  const dom = await render(
    <CodeEditor
      language="dotEnv"
      value={"API_KEY=secret\nAPI_KEY=other\n"}
      aria-label="Environment"
    />,
  );

  const codeMirror = dom
    .getByLocator(".flow--code-editor--code-mirror")
    .element();
  const marker = dom.getByLocator(".cm-lint-marker-error");

  await userEvent.hover(marker);

  /* Hovering a gutter marker makes the diagnostics list the tooltip itself. */
  const tooltip = dom.getByLocator(".cm-tooltip.cm-tooltip-lint");
  await expect.element(tooltip).toBeInTheDocument();

  expect(getComputedStyle(tooltip.element()).backgroundColor).toBe(
    resolveColor(codeMirror, "var(--popover--background-color)"),
  );
  expect(getComputedStyle(tooltip.element()).color).toBe(
    resolveColor(codeMirror, "var(--text--color--default)"),
  );
});

/* The x position of the first character of a line's text. */
const textStart = (line: Element) => {
  const text = document.createTreeWalker(line, NodeFilter.SHOW_TEXT).nextNode();
  if (!text) {
    throw new Error("The line has no text.");
  }
  const range = document.createRange();
  range.setStart(text, 0);
  range.setEnd(text, 1);
  return range.getBoundingClientRect().left;
};

test.each([
  ["without", false],
  ["with", true],
])(
  "the CodeEditor indentation markers sit on their level %s line numbers",
  async (_, showLineNumbers) => {
    const dom = await render(
      <CodeEditor
        language="json"
        value={'{\n  "jedi": true\n}'}
        aria-label="Source code"
        showLineNumbers={showLineNumbers}
      />,
    );

    const indented = dom.getByLocator(".cm-indent-markers").first().element();
    const opening = dom.getByLocator(".cm-line").first().element();

    /*
     * The library draws the first marker half a character into the area of
     * `::before`, so it lies where the text of the opening line starts.
     */
    const probe = document.createElement("span");
    probe.textContent = "0";
    indented.append(probe);
    const characterWidth = probe.getBoundingClientRect().width;
    probe.remove();

    const markerX =
      indented.getBoundingClientRect().left +
      parseFloat(getComputedStyle(indented, "::before").left) +
      characterWidth / 2;

    expect(markerX).toBeCloseTo(textStart(opening), 0);
  },
);
