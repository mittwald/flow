import type { RefObject } from "react";

export type InsertType =
  | "bold"
  | "italic"
  | "strikeThrough"
  | "quote"
  | "code"
  | "link"
  | "unorderedList"
  | "orderedList";

const markdownSyntax: Record<
  InsertType,
  { before: string; after?: string; toggleable?: boolean }
> = {
  bold: { before: "**", after: "**", toggleable: true },
  italic: { before: "_", after: "_", toggleable: true },
  strikeThrough: { before: "~~", after: "~~", toggleable: true },
  quote: { before: "> " },
  code: { before: "`", after: "`", toggleable: true },
  link: { before: "[", after: "](https://)" },
  unorderedList: { before: "- " },
  orderedList: { before: "1. " },
};

const getLineStart = (text: string, pos: number) => {
  const lastNewline = text.lastIndexOf("\n", pos - 1);
  return lastNewline === -1 ? 0 : lastNewline + 1;
};

const getLineEnd = (text: string, pos: number) => {
  const nextNewline = text.indexOf("\n", pos);
  return nextNewline === -1 ? text.length : nextNewline;
};

export const insertAtCursor = (
  markdown: string,
  setMarkdown: (markdown: string) => void,
  textAreaRef: RefObject<HTMLTextAreaElement | null>,
  type: InsertType,
  onChange?: (markdown: string) => void,
) => {
  const textarea = textAreaRef.current;
  if (!textarea) return;

  const { before, after = "", toggleable = false } = markdownSyntax[type];
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = markdown.substring(start, end);
  const lines = selectedText.split("\n");

  let newText = markdown;
  let selectionStart = start;
  let selectionEnd = end;

  if (type === "code" && selectedText.includes("\n")) {
    newText =
      markdown.substring(0, start) +
      "```\n" +
      selectedText +
      "\n```\n" +
      markdown.substring(end);
    selectionStart = start + 4;
    selectionEnd = selectionStart + selectedText.length;
  } else if (type === "orderedList") {
    if (selectedText) {
      const numbered = lines.map((line, i) => `${i + 1}. ${line}`).join("\n");
      newText =
        markdown.substring(0, start) + numbered + markdown.substring(end);
      selectionStart = start;
      selectionEnd = start + numbered.length;
    } else {
      const lineStart = getLineStart(markdown, start);
      const lineEnd = getLineEnd(markdown, start);
      const numberedLine = `1. ${markdown.substring(lineStart, lineEnd)}`;

      newText =
        markdown.substring(0, lineStart) +
        before +
        markdown.substring(lineStart);
      selectionStart = lineStart + numberedLine.length;
      selectionEnd = selectionStart;
    }
  } else if (type === "unorderedList") {
    if (selectedText) {
      const bulleted = lines.map((line) => `${before}${line}`).join("\n");
      newText =
        markdown.substring(0, start) + bulleted + markdown.substring(end);
      selectionStart = start;
      selectionEnd = start + bulleted.length;
    } else {
      const lineStart = getLineStart(markdown, start);
      const lineEnd = getLineEnd(markdown, start);
      const bulletedLine = `- ${markdown.substring(lineStart, lineEnd)}`;

      newText =
        markdown.substring(0, lineStart) +
        before +
        markdown.substring(lineStart);
      selectionStart = lineStart + bulletedLine.length;
      selectionEnd = selectionStart;
    }
  } else if (type === "quote") {
    if (selectedText) {
      const quoted = lines.map((line) => `${before}${line}`).join("\n");
      newText = markdown.substring(0, start) + quoted + markdown.substring(end);
      selectionStart = start;
      selectionEnd = start + quoted.length;
    } else {
      const quoteLine = `\n${before} `;
      newText =
        markdown.substring(0, start) + quoteLine + markdown.substring(end);
      selectionStart = start + quoteLine.length;
      selectionEnd = selectionStart;
    }
  } else if (toggleable) {
    const prefix = markdown.substring(start - before.length, start);
    const suffix = markdown.substring(end, end + after.length);
    const isSurrounded = prefix === before && suffix === after;
    const isWrappedInside =
      selectedText.startsWith(before) && selectedText.endsWith(after);

    if (isSurrounded) {
      // Remove external wrapping (not selected)
      newText =
        markdown.substring(0, start - before.length) +
        selectedText +
        markdown.substring(end + after.length);
      selectionStart = start - before.length;
      selectionEnd = selectionStart + selectedText.length;
    } else if (isWrappedInside) {
      // Remove internal wrapping (selected)
      const unwrapped = selectedText.slice(
        before.length,
        selectedText.length - after.length,
      );
      newText =
        markdown.substring(0, start) + unwrapped + markdown.substring(end);
      selectionStart = start;
      selectionEnd = start + unwrapped.length;
    } else {
      // Add wrapping
      newText =
        markdown.substring(0, start) +
        before +
        selectedText +
        after +
        markdown.substring(end);

      if (selectedText.length === 0) {
        selectionStart = start + before.length;
        selectionEnd = selectionStart;
      } else {
        selectionStart = start + before.length;
        selectionEnd = selectionStart + selectedText.length;
      }
    }
  } else if (type === "link") {
    let linkText = "";
    let linkUrl = "";
    let inserted = "";
    let cursorOffsetStart = 0;

    const isValidUrl = (str: string): boolean => {
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    };

    if (selectedText) {
      if (isValidUrl(selectedText)) {
        linkUrl = selectedText;
        inserted = `[](${linkUrl})`;
        cursorOffsetStart = start + 1;
      } else {
        linkText = selectedText;
        inserted = `[${linkText}]()`;
        cursorOffsetStart = start + inserted.indexOf("](") + 2;
      }
    } else {
      inserted = `[](https://)`;
      cursorOffsetStart = start + 1;
    }

    newText = markdown.substring(0, start) + inserted + markdown.substring(end);
    selectionStart = selectionEnd = cursorOffsetStart;
  } else {
    // Fallback for non-toggleable, inline syntax
    newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);

    if (selectedText.length === 0) {
      // No text selected – place cursor between syntax
      selectionStart = start + before.length;
      selectionEnd = selectionStart;
    } else {
      // Keep selection
      selectionStart = start + before.length;
      selectionEnd = selectionStart + selectedText.length;
    }
  }

  setMarkdown(newText);
  if (onChange) onChange(newText);

  requestAnimationFrame(() => {
    textarea.setSelectionRange(selectionStart, selectionEnd);
    textarea.focus();
  });
};
