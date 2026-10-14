import { rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect } from "vitest";

/*
 * Synchronizing a visual scenario on CodeMirror's syntax highlighting, which the
 * screenshot preamble cannot wait for either.
 *
 * CodeMirror parses the code when the editor is created, but for at most 20ms.
 * Whatever it has not parsed by then stays plain, and the rest is parsed in an
 * idle callback 100 to 500ms later. The preamble only waits for 100ms without
 * DOM mutations, so it can let the plain frame through, and two identical plain
 * frames pass the matcher's stability check. `update-screenshots` on #3504
 * committed such a frame as the `Markdown content` reference: only the opening
 * `{` colored, everything after it plain.
 *
 * The highlighter wraps every token it colors in a `<span>`, plain text sits
 * directly in the `.cm-line`. It colors a prefix of the code, the part the
 * parser has reached. So the code is highlighted through to its end once its
 * last token is wrapped. That needs code ending on a token the highlighter
 * colors, as a JSON object does with its closing brace.
 */

/*
 * CodeMirror's content element is the `textbox`, and it carries
 * `data-language` while a language highlights it. In `Remote`, the hidden
 * mirror of the remote tree inside the container holds no editor DOM, only the
 * `flr-*` elements and their texts.
 */
const highlightingEditors = (): Element[] =>
  rootContainerLocator
    .getByRole("textbox")
    .elements()
    .filter((editor) => editor.hasAttribute("data-language"));

const isHighlightedToTheEnd = (editor: Element): boolean => {
  const texts = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
  let lastToken: Node | null = null;

  while (texts.nextNode()) {
    if (texts.currentNode.textContent?.trim()) {
      lastToken = texts.currentNode;
    }
  }

  const parent = lastToken?.parentElement;
  return !!parent && !parent.classList.contains("cm-line");
};

/*
 * The editors in the scenario that highlight a language, and how many of them
 * are highlighted through to the end of their code.
 */
const codeHighlighting = (): {
  editors: number;
  highlighted: number;
} => {
  const editors = highlightingEditors();
  return {
    editors: editors.length,
    highlighted: editors.filter(isHighlightedToTheEnd).length,
  };
};

/*
 * Called right after `render()`, so the budget also covers `Remote`
 * materialising the host tree, which `waitForPaintedContent` gives 20s. It
 * stays below the project's 60s `testTimeout`, so a scenario that never gets
 * there fails with the message below.
 */
const highlightingTimeout = 20_000;

/**
 * Waits until the scenario shows `editors` editors that highlight a language,
 * each highlighted through to the end of its code.
 */
export const waitForHighlightedCode = async (
  editors: number,
): Promise<void> => {
  await expect
    .poll(codeHighlighting, {
      timeout: highlightingTimeout,
      message:
        "The code was never highlighted through to its end, so the capture would have shown it (partly) plain. The check needs code that ends on a token the highlighter colors.",
    })
    .toEqual({ editors, highlighted: editors });
};
