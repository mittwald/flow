import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import { page, userEvent } from "vitest/browser";

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
  ],
  [
    "continues unordered list (-)",
    "- First item\n- Second item",
    "- First item\n- Second item\n- ",
  ],
  [
    "continues unordered list (*)",
    "* First item\n* Second item",
    "* First item\n* Second item\n* ",
  ],
  [
    "continues unordered list (+)",
    "+ First item\n+ Second item",
    "+ First item\n+ Second item\n+ ",
  ],
  [
    "exits list if current line is empty (ordered)",
    "1. First item\n2. ",
    "1. First item\n\n",
  ],
  [
    "exits list if current line is empty (unordered)",
    "- First item\n- ",
    "- First item\n\n",
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
  ],
];

describe("MarkdownEditor Tests", () => {
  test.each(FormatButtonTestCases)(
    "test formatted message with button type '%s' (%$)",
    async (type, text, expectedResult) => {
      const user = userEvent;
      const onChangeEvent = vi.fn();

      const editor = (
        <MarkdownEditor
          aria-label="test"
          data-testid="markdown"
          defaultValue="dummyDefault"
          onChange={onChangeEvent}
        />
      );
      const { rerender } = await render(editor);

      const textArea = page.getByRole("textbox");

      expect(textArea).toBeInTheDocument();
      expect(textArea).toHaveDisplayValue("dummyDefault");

      const modifierButton = page.getByLocator(`[data-button-type="${type}"]`);
      expect(modifierButton).toBeInTheDocument();

      text = String(text ?? "");
      expectedResult = String(expectedResult ?? "");

      await user.clear(textArea);
      await user.type(textArea, text);
      await user.keyboard("{selectall}");
      await user.click(modifierButton);

      // wait a render circle to let the editor update its value
      await rerender(editor);

      expect(textArea).toHaveDisplayValue(expectedResult);

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
    async (testName, defaultValue, expectedResult) => {
      const onChangeEvent = vi.fn();

      defaultValue = String(defaultValue ?? "");
      expectedResult = String(expectedResult ?? "");

      await render(
        <MarkdownEditor
          aria-label="test"
          data-testid="markdown"
          onChange={onChangeEvent}
          defaultValue={defaultValue}
        />,
      );

      const markdownEditor = page.getByRole("textbox");
      expect(markdownEditor).toBeInTheDocument();

      await userEvent.type(
        markdownEditor,
        "{ArrowDown}{ArrowDown}{ArrowDown}{End}",
      );
      await userEvent.type(markdownEditor, "{Enter}");

      if (testName === "does nothing outside of list") {
        expectedResult = expectedResult + "\n";
      }

      expect(markdownEditor).toHaveDisplayValue(expectedResult);
      expect(onChangeEvent).toHaveBeenLastCalledWith(expectedResult);
    },
  );
});
