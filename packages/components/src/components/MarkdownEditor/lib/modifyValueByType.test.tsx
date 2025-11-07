import {
  type InsertType,
  modifyValueByType,
} from "@/components/MarkdownEditor/lib/modifyValueByType";
import { FormatButtonTestCases } from "@/components/MarkdownEditor/MarkdownEditor.test";

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
