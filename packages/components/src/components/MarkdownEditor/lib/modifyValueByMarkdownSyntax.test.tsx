import { modifyValueByMarkdownSyntax } from "@/components/MarkdownEditor/lib/modifyValueByMarkdownSyntax";
import { FormatInlineTestCases } from "@/components/MarkdownEditor/MarkdownEditor.test";

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
