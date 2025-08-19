import { fireEvent, render } from "@testing-library/react";
import React, { useRef, useState } from "react";
import type { InsertType } from "./insertAtCursor";
import { insertAtCursor } from "./insertAtCursor";

describe("insertAtCursor", () => {
  const TestComponent = ({
    markdown,
    type,
  }: {
    markdown: string;
    type: InsertType;
  }) => {
    const [text, setText] = useState(markdown);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleInsert = () => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = 0;
        textareaRef.current.selectionEnd = markdown.length;
      }
      insertAtCursor(text, setText, textareaRef, type);
    };

    return (
      <div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleInsert}>Insert</button>
      </div>
    );
  };

  test("inserts bold syntax correctly", async () => {
    const { getByText } = render(
      <TestComponent markdown="Hello world" type="bold" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(getByText("**Hello world**")).toBeDefined();
  });

  test("inserts italic syntax correctly", () => {
    const { getByText } = render(
      <TestComponent markdown="Hello world" type="italic" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(getByText("*Hello world*")).toBeDefined();
  });

  test("inserts strikethrough syntax correctly", () => {
    const { getByText } = render(
      <TestComponent markdown="Hello world" type="strikeThrough" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(getByText("~~Hello world~~")).toBeDefined();
  });

  test("inserts quote syntax correctly", () => {
    const { getByText, container } = render(
      <TestComponent markdown="Hello world" type="quote" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(container).toContainHTML("&gt; Hello world");
  });

  test("inserts code syntax correctly", () => {
    const { getByText } = render(
      <TestComponent markdown="Hello world" type="code" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(getByText("`Hello world`")).toBeDefined();
  });

  test("inserts link syntax correctly for marked text", () => {
    const { getByText } = render(
      <TestComponent markdown="Hello world" type="link" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(getByText("[Hello world]()")).toBeDefined();
  });

  test("inserts link syntax correctly for marked link", () => {
    const { getByText } = render(
      <TestComponent markdown="https://mittwald.github.io/flow/" type="link" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(getByText("[](https://mittwald.github.io/flow/)")).toBeDefined();
  });

  test("inserts unordered list syntax correctly", () => {
    const { getByText, container } = render(
      <TestComponent markdown={"Hello\nWorld"} type="unorderedList" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(container).toContainHTML("- Hello\n- World");
  });

  test("inserts ordered list syntax correctly", () => {
    const { getByText, container } = render(
      <TestComponent markdown={"Hello\nWorld"} type="orderedList" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(container).toContainHTML("1. Hello\n2. World");
  });

  test("toggles bold syntax when text is already wrapped", () => {
    const { getByText } = render(
      <TestComponent markdown="**Hello world**" type="bold" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(getByText("Hello world")).toBeDefined();
  });

  test("handles code block with line breaks", () => {
    const { getByText, container } = render(
      <TestComponent markdown={"Hello\nworld"} type="code" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(container).toContainHTML("```\nHello\nworld\n```\n");
  });

  test("renders bold syntax on empty markdown correctly ", () => {
    const { getByText, container } = render(
      <TestComponent markdown={"Hello\nworld"} type="code" />,
    );

    fireEvent.click(getByText("Insert"));
    expect(container).toContainHTML("```\nHello\nworld\n```\n");
  });
});
