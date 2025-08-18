import React, { useRef, useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import { handleKeyDown } from "./handleKeyDown";

describe("handleKeyDown", () => {
  const TestComponent = ({ initial }: { initial: string }) => {
    const [markdown, setMarkdown] = useState(initial);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    return (
      <textarea
        ref={textareaRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, textareaRef, setMarkdown)}
        data-testid="editor"
      />
    );
  };

  const triggerEnter = (input: string, cursorOffset: number = input.length) => {
    const utils = render(<TestComponent initial={input} />);
    const textarea = utils.getByTestId("editor") as HTMLTextAreaElement;

    textarea.setSelectionRange(cursorOffset, cursorOffset);
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter" });

    return textarea.value;
  };

  test("continues ordered list on Enter", () => {
    const result = triggerEnter("1. First item\n2. Second item");
    expect(result).toBe("1. First item\n2. Second item\n3. ");
  });

  test("continues unordered list (-) on Enter", () => {
    const result = triggerEnter("- First item\n- Second item");
    expect(result).toBe("- First item\n- Second item\n- ");
  });

  test("continues unordered list (*) on Enter", () => {
    const result = triggerEnter("* First item\n* Second item");
    expect(result).toBe("* First item\n* Second item\n* ");
  });

  test("continues unordered list (+) on Enter", () => {
    const result = triggerEnter("+ First item\n+ Second item");
    expect(result).toBe("+ First item\n+ Second item\n+ ");
  });

  test("exits list if current line is empty (ordered)", () => {
    const result = triggerEnter("1. First item\n2. ");
    expect(result).toBe("1. First item\n\n");
  });

  test("exits list if current line is empty (unordered)", () => {
    const result = triggerEnter("- First item\n- ");
    expect(result).toBe("- First item\n\n");
  });

  test("does nothing on Enter outside of list", () => {
    const result = triggerEnter("Just some text");
    expect(result).toBe("Just some text");
  });
});
