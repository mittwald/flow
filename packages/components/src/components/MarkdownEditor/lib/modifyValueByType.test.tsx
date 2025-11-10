import {
  type InsertType,
  modifyValueByType,
} from "@/components/MarkdownEditor/lib/modifyValueByType";

const FormatButtonTestCases = [
  ["bold", "Hello world", "**Hello world**", 2, 13],
  ["bold", "**Hello world**", "Hello world", 0, 11],
  ["italic", "Hello world", "_Hello world_", 1, 12],
  ["strikeThrough", "Hello world", "~~Hello world~~", 2, 13],
  ["quote", "Hello world", "> Hello world", 0, 13],
  ["code", "Hello world", "`Hello world`", 1, 12],
  ["code", "Hello\nworld", "```\nHello\nworld\n```\n", 4, 15],
  ["unorderedList", "Hello\nWorld", "- Hello\n- World", 0, 15],
  ["orderedList", "Hello\nWorld", "1. Hello\n2. World", 0, 17],
  ["link", "Hello world", "[Hello world]()", 14, 14],
  [
    "link",
    "https://mittwald.github.io/flow/",
    "[](https://mittwald.github.io/flow/)",
    1,
    1,
  ],
];

describe("will format a give string to markdown", () => {
  test.each(FormatButtonTestCases)(
    "mode %s",
    (type, text, expectedResult, expectedStart, expectedEnd) => {
      text = String(text ?? "");
      const { newValue, newSelectionStart, newSelectionEnd } =
        modifyValueByType(text, type as InsertType, {
          current: {
            selectionStart: 0,
            selectionEnd: text.length,
          } as never,
        });

      expect(newValue).toBe(expectedResult);
      expect(newSelectionStart).toBe(expectedStart);
      expect(newSelectionEnd).toBe(expectedEnd);
    },
  );
});
