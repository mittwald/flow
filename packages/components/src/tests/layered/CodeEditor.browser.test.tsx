import CodeEditor from "@/components/CodeEditor";
import { render } from "vitest-browser-react";

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

  expect(getComputedStyle(line).paddingInlineStart).toBe(
    resolveLength(codeMirror, "var(--form-control--padding-x)"),
  );
});
