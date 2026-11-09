import CodeEditor from "@/components/CodeEditor";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

/*
 * A policy stays in force for the whole document, so it gets a test file – and
 * with it a document – of its own.
 */
const nonce = "flow-test-nonce";

const addMeta = (attributes: Record<string, string>) => {
  const meta = document.createElement("meta");
  for (const [name, value] of Object.entries(attributes)) {
    meta.setAttribute(name, value);
  }
  document.head.append(meta);
};

addMeta({ property: "csp-nonce", content: nonce, nonce });
addMeta({
  "http-equiv": "Content-Security-Policy",
  content: `style-src 'self' 'nonce-${nonce}'`,
});

test("CodeEditor keeps its height when text is selected under a nonce-based CSP", async () => {
  const code = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n");
  const dom = await render(<CodeEditor value={code} aria-label="Code" />);

  const textbox = dom.getByRole("textbox");
  const editor = textbox.element().closest(".cm-editor");
  assert(editor);
  const heightBefore = editor.getBoundingClientRect().height;

  await userEvent.click(textbox);
  await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");

  await expect
    .poll(() => document.getSelection()?.toString())
    .toContain("line 20");
  expect(editor.getBoundingClientRect().height).toBe(heightBefore);
});
