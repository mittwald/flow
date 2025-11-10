import { modifyValueByMarkdownSyntax } from "@/components/MarkdownEditor/lib/modifyValueByMarkdownSyntax";

const FormatInlineTestCases = [
  [
    "continues ordered list",
    "1. First item\n2. Second item",
    "1. First item\n2. Second item\n3. ",
    32,
    32,
  ],
  [
    "continues unordered list (-)",
    "- First item\n- Second item",
    "- First item\n- Second item\n- ",
    29,
    29,
  ],
  [
    "continues unordered list (*)",
    "* First item\n* Second item",
    "* First item\n* Second item\n* ",
    29,
    29,
  ],
  [
    "continues unordered list (+)",
    "+ First item\n+ Second item",
    "+ First item\n+ Second item\n+ ",
    29,
    29,
  ],
  [
    "exits list if current line is empty (ordered)",
    "1. First item\n2. ",
    "1. First item\n\n",
    15,
    15,
  ],
  [
    "exits list if current line is empty (unordered)",
    "- First item\n- ",
    "- First item\n\n",
    14,
    14,
  ],
  ["does nothing outside of list", "Just some text", "Just some text", 15, 15],
];

describe("will format a give string to markdown", () => {
  test.each(FormatInlineTestCases)(
    "%s",
    (testName, text, expectedResult, expectedStart, expectedEnd) => {
      text = String(text ?? "");

      const modifyParams = modifyValueByMarkdownSyntax(text, {
        current: {
          selectionStart: text.length,
          selectionEnd: text.length,
        } as never,
      });

      if (!modifyParams) {
        expect(testName).toBe("does nothing outside of list");
        return;
      }

      const { newValue, newSelectionStart, newSelectionEnd } = modifyParams;

      expect(newValue).toBe(expectedResult);
      expect(newSelectionStart).toBe(expectedStart);
      expect(newSelectionEnd).toBe(expectedEnd);
    },
  );
});
