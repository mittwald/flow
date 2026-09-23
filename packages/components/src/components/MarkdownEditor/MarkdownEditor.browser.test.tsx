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

describe("MarkdownEditor file upload", () => {
  const imageFile = (name = "cat.png") =>
    new File(["binary"], name, { type: "image/png" });

  const fileTransfer = (...files: File[]) => {
    const transfer = new DataTransfer();
    for (const file of files) {
      transfer.items.add(file);
    }
    return transfer;
  };

  /*
   * The toolbar's input is visually hidden, so it is set directly instead of
   * going through the OS file dialog a click would open.
   */
  const selectFiles = (...files: File[]) => {
    const input =
      document.querySelector<HTMLInputElement>('input[type="file"]');

    if (!input) {
      throw new Error("The editor rendered no file input");
    }

    input.files = fileTransfer(...files).files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const textArea = () => {
    const element = document.querySelector("textarea");

    if (!element) {
      throw new Error("The editor rendered no textarea");
    }

    return element;
  };

  test("replaces the placeholder with markdown once the upload resolves", async () => {
    let resolveUpload!: (upload: { url: string }) => void;

    await render(
      <MarkdownEditor
        aria-label="Message"
        defaultValue="Look at this:"
        uploadFile={() =>
          new Promise<{ url: string }>((resolve) => {
            resolveUpload = resolve;
          })
        }
      />,
    );

    selectFiles(imageFile());

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue('Look at this:\n<!-- Uploading "cat.png"... -->\n');

    resolveUpload({ url: "https://cdn.example/cat.png" });

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue("Look at this:\n![cat.png](https://cdn.example/cat.png)\n");
  });

  test("links a file that is not an image", async () => {
    await render(
      <MarkdownEditor
        aria-label="Message"
        uploadFile={async () => ({ url: "https://cdn.example/r.pdf" })}
      />,
    );

    selectFiles(
      new File(["binary"], "report.pdf", { type: "application/pdf" }),
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue("[report.pdf](https://cdn.example/r.pdf)\n");
  });

  test("takes the placeholder back out when the upload fails", async () => {
    await render(
      <MarkdownEditor
        aria-label="Message"
        defaultValue="Look at this:"
        uploadFile={() => Promise.reject(new Error("no upload service"))}
      />,
    );

    selectFiles(imageFile());

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue("Look at this:\n");
  });

  test("keeps the placeholder of the file that is still uploading", async () => {
    const resolvers = new Map<string, (upload: { url: string }) => void>();

    await render(
      <MarkdownEditor
        aria-label="Message"
        uploadFile={(file) =>
          new Promise<{ url: string }>((resolve) => {
            resolvers.set(file.name, resolve);
          })
        }
      />,
    );

    selectFiles(imageFile("one.png"), imageFile("two.png"));

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue(
        '<!-- Uploading "one.png"... -->\n<!-- Uploading "two.png"... -->\n',
      );

    resolvers.get("two.png")?.({ url: "https://cdn.example/two.png" });

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue(
        '<!-- Uploading "one.png"... -->\n![two.png](https://cdn.example/two.png)\n',
      );
  });

  test("uploads a pasted file and leaves a pasted text alone", async () => {
    await render(
      <MarkdownEditor
        aria-label="Message"
        uploadFile={async () => ({ url: "https://cdn.example/cat.png" })}
      />,
    );

    const input = textArea();
    input.focus();

    input.dispatchEvent(
      new ClipboardEvent("paste", {
        clipboardData: fileTransfer(imageFile()),
        bubbles: true,
        cancelable: true,
      }),
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue("![cat.png](https://cdn.example/cat.png)\n");

    const textPaste = new ClipboardEvent("paste", {
      clipboardData: new DataTransfer(),
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(textPaste);

    expect(textPaste.defaultPrevented).toBe(false);
  });

  test("skips a file the accept list does not cover", async () => {
    const uploadFile = vi.fn(async () => ({ url: "https://cdn.example/a" }));

    await render(
      <MarkdownEditor
        aria-label="Message"
        accept="image/*"
        uploadFile={uploadFile}
      />,
    );

    textArea().dispatchEvent(
      new ClipboardEvent("paste", {
        clipboardData: fileTransfer(
          new File(["binary"], "notes.txt", { type: "text/plain" }),
        ),
        bubbles: true,
        cancelable: true,
      }),
    );

    await expect.element(page.getByRole("textbox")).toHaveValue("");
    expect(uploadFile).not.toHaveBeenCalled();
  });

  /*
   * Clicking the attachment button takes the focus out of the textarea, so the
   * caret cannot be read from `document.activeElement`. A textarea keeps its
   * `selectionStart` across the blur, and that is what the insert has to use —
   * otherwise every file picked with the button lands at the end of the text.
   */
  test("inserts at the caret the textarea had before the button took focus", async () => {
    await render(
      <MarkdownEditor
        aria-label="Message"
        defaultValue="AB"
        uploadFile={() => new Promise<{ url: string }>(() => undefined)}
      />,
    );

    const input = textArea();
    input.focus();
    input.setSelectionRange(1, 1);

    await userEvent.click(page.getByRole("button", { name: "Attach file" }));
    selectFiles(imageFile());

    await expect
      .element(page.getByRole("textbox"))
      .toHaveValue('A\n<!-- Uploading "cat.png"... -->\nB');
  });

  /*
   * The toolbar renders inside the TextArea, so the hidden file input sits
   * inside its `Aria.TextField`. An `Aria.Input` there reads the field's own
   * value out of `InputContext`, and a file input rejects any value but the
   * empty string — so the editor threw the moment it held any text. The input
   * is a plain one for that reason; this test is what says so out loud.
   */
  test("keeps taking text while the attachment button is rendered", async () => {
    await render(
      <MarkdownEditor
        aria-label="Message"
        uploadFile={async () => ({ url: "https://cdn.example/a" })}
      />,
    );

    await userEvent.fill(page.getByRole("textbox"), "hello");

    await expect.element(page.getByRole("textbox")).toHaveValue("hello");
  });

  /*
   * The attachment button behaves like every other tool: preview mode disables
   * it rather than removing it, so the toolbar keeps its shape.
   */
  test.each([
    ["preview mode", {}, true],
    ["a disabled editor", { isDisabled: true }, false],
    ["a read-only editor", { isReadOnly: true }, false],
  ] as const)(
    "disables the attachment button in %s instead of hiding it",
    async (_name, props, enterPreview) => {
      await render(
        <MarkdownEditor
          {...props}
          aria-label="Message"
          uploadFile={async () => ({ url: "https://cdn.example/a" })}
        />,
      );

      if (enterPreview) {
        await userEvent.click(page.getByRole("button", { name: "Preview" }));
      }

      await expect
        .element(page.getByRole("button", { name: "Attach file" }))
        .toBeDisabled();
    },
  );

  test("offers no attachment button without an upload handler", async () => {
    await render(<MarkdownEditor aria-label="Message" />);

    await expect
      .element(page.getByRole("button", { name: "Bold" }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "Attach file" }))
      .not.toBeInTheDocument();
  });
});
