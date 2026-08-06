import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import type { MarkdownProps } from "@/components/Markdown";
import { page, userEvent } from "vitest/browser";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/Button";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";
import { useState } from "react";

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
  ["link", "https://flow.mittwald.de/", "[](https://flow.mittwald.de/)"],
];

describe("MarkdownEditor Tests", () => {
  test("renders and executes custom toolbar button children", async () => {
    const onChangeEvent = vi.fn();

    const TestComponent = () => {
      const [value, setValue] = useState("hello");

      return (
        <MarkdownEditor
          aria-label="test"
          data-testid="markdown"
          value={value}
          onChange={(nextValue) => {
            onChangeEvent(nextValue);
            setValue(nextValue);
          }}
        >
          <Button
            aria-label="Append world"
            onPress={() => {
              setValue((currentValue) => `${currentValue} world`);
            }}
          >
            +
          </Button>
        </MarkdownEditor>
      );
    };

    await render(<TestComponent />);

    const textArea = page.getByRole("textbox");
    const customToolButton = page.getByRole("button", {
      name: "Append world",
    });
    const orderedListButton = page.getByLocator(
      '[data-button-type="orderedList"]',
    );

    expect(customToolButton).toBeInTheDocument();
    const customToolButtonElement = await customToolButton.element();
    const orderedListButtonElement = await orderedListButton.element();
    const isRenderedAfterToolbarButtons = !!(
      orderedListButtonElement.compareDocumentPosition(
        customToolButtonElement,
      ) & Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(isRenderedAfterToolbarButtons).toBe(true);

    await userEvent.click(customToolButton);

    expect(textArea).toHaveDisplayValue("hello world");
  });

  test("supports context menus and modals as toolbar children", async () => {
    await render(
      <MarkdownEditor aria-label="test" defaultValue="hello">
        <ContextMenuTrigger>
          <Button aria-label="Open snippets">Menu</Button>
          <ContextMenu>
            <MenuItem id="signature">Insert signature</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <ModalTrigger>
          <Button aria-label="Open template modal">Modal</Button>
          <Modal>
            <Heading>Insert template</Heading>
            <Content>
              <Text>Choose a predefined text block.</Text>
            </Content>
          </Modal>
        </ModalTrigger>
      </MarkdownEditor>,
    );

    await userEvent.click(page.getByRole("button", { name: "Open snippets" }));
    await expect(
      page.getByRole("menuitem", { name: "Insert signature" }),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");

    await userEvent.click(
      page.getByRole("button", { name: "Open template modal" }),
    );
    await expect(
      page.getByRole("heading", { name: "Insert template" }),
    ).toBeInTheDocument();
  });

  test("disables toolbar trigger buttons in preview mode", async () => {
    await render(
      <MarkdownEditor aria-label="test" defaultValue="hello">
        <ContextMenuTrigger>
          <Button aria-label="Open snippets">Menu</Button>
          <ContextMenu>
            <MenuItem id="signature">Insert signature</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <ModalTrigger>
          <Button aria-label="Open template modal">Modal</Button>
          <Modal>
            <Heading>Insert template</Heading>
            <Content>
              <Text>Choose a predefined text block.</Text>
            </Content>
          </Modal>
        </ModalTrigger>
      </MarkdownEditor>,
    );

    await userEvent.click(page.getByRole("button", { name: "Preview" }));

    await expect(
      page.getByRole("button", { name: "Open snippets" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Open template modal" }),
    ).toBeDisabled();
  });

  test("keeps label and description outside of toolbar while tunneling actions", async () => {
    await render(
      <MarkdownEditor aria-label="test" defaultValue="hello">
        <Label>Markdown</Label>
        <FieldDescription>Description text</FieldDescription>
        <Button aria-label="Custom action">+</Button>
      </MarkdownEditor>,
    );

    const toolbar = await page.getByRole("toolbar").element();
    const customActionButton = await page
      .getByRole("button", { name: "Custom action" })
      .element();
    const label = await page.getByText("Markdown").element();
    const description = await page.getByText("Description text").element();

    expect(toolbar.contains(customActionButton)).toBe(true);
    expect(toolbar.contains(label)).toBe(false);
    expect(toolbar.contains(description)).toBe(false);
  });

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

  test("uses custom a-tag handling for mentions in preview mode", async () => {
    const MentionMarkdownPreview = ({
      children,
      className,
      style,
    }: MarkdownProps) => (
      <div className={className} style={style}>
        <ReactMarkdown
          components={{
            a: ({ href, children }) => {
              if (href?.startsWith("mention:")) {
                return <span data-testid="mention-chip">@{children}</span>;
              }

              return <a href={href}>{children}</a>;
            },
          }}
          urlTransform={(url) => {
            // add urlTransform to support custom protocols in `react-markdown`
            return url;
          }}
        >
          {String(children ?? "")}
        </ReactMarkdown>
      </div>
    );

    await render(
      <MarkdownEditor
        aria-label="test"
        defaultValue="Hello [max](mention:user-max)."
        markdownComponent={MentionMarkdownPreview}
      />,
    );

    await userEvent.click(page.getByRole("button", { name: "Preview" }));

    const mentionChip = page.getByTestId("mention-chip");
    await expect(mentionChip).toBeInTheDocument();
    await expect(mentionChip).toHaveTextContent("@max");
  });
});
