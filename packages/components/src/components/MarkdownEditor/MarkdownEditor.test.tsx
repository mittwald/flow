import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";

const expandSteps = (value: string) => {
  const result = [];
  for (let i = 1; i <= value.length; i++) {
    result.push(value.slice(0, i));
  }
  return result;
};

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

describe("MarkdownEditor Tests", () => {
  test.each(FormatButtonTestCases)(
    "test formatted message with button type '%s'",
    async (type, text, expectedResult, expectedStart, expectedEnd) => {
      const user = userEvent.setup();
      const onChangeEvent = vi.fn();

      const renderResult = render(
        <MarkdownEditor
          data-testid="markdown"
          defaultValue="dummyDefault"
          onChange={onChangeEvent}
        />,
      );

      const markdownEditor = renderResult
        .getByTestId("markdown")
        .querySelector("textarea");

      expect(markdownEditor).toBeInTheDocument();
      expect(markdownEditor).toHaveDisplayValue("dummyDefault");

      assert(markdownEditor);

      const modifierButton = renderResult.container.querySelector(
        `[data-button-type="${type}"]`,
      );
      expect(modifierButton).toBeInTheDocument();
      assert(modifierButton);

      text = String(text ?? "");
      expectedResult = String(expectedResult ?? "");

      await user.clear(markdownEditor);
      await user.type(markdownEditor, text);
      await user.click(markdownEditor);
      await userEvent.keyboard("{Control>}A{/Control}");
      await user.click(modifierButton);

      expect(markdownEditor).toHaveDisplayValue(expectedResult);
      expect(markdownEditor.selectionStart).toBe(expectedStart);
      expect(markdownEditor.selectionEnd).toBe(expectedEnd);

      const expectedChangeEvents = [
        "", // clear
        ...expandSteps(text), // user type
        expectedResult, // expected result
      ];

      expectedChangeEvents.forEach((value, index) => {
        expect(onChangeEvent).toHaveBeenNthCalledWith(index + 1, value);
      });
    },
  );
  test.each(FormatInlineTestCases)(
    "test inline formatted message > %s",
    async (
      testName,
      defaultValue,
      expectedResult,
      expectedStart,
      expectedEnd,
    ) => {
      const user = userEvent.setup();
      const onChangeEvent = vi.fn();

      defaultValue = String(defaultValue ?? "");
      expectedResult = String(expectedResult ?? "");

      const renderResult = render(
        <MarkdownEditor
          data-testid="markdown"
          defaultValue={defaultValue}
          onChange={onChangeEvent}
        />,
      );

      const markdownEditor = renderResult
        .getByTestId("markdown")
        .querySelector("textarea");

      expect(markdownEditor).toBeInTheDocument();
      expect(markdownEditor).toHaveDisplayValue(defaultValue);

      assert(markdownEditor);

      await user.type(markdownEditor, "{enter}");

      if (testName === "does nothing outside of list") {
        expectedResult = expectedResult + "\n";
      }

      expect(markdownEditor).toHaveDisplayValue(expectedResult);
      expect(markdownEditor.selectionStart).toBe(expectedStart);
      expect(markdownEditor.selectionEnd).toBe(expectedEnd);

      expect(onChangeEvent).toHaveBeenLastCalledWith(expectedResult);
    },
  );
});
