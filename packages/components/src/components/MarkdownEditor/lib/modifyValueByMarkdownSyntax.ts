import type { RefObject } from "react";

export const scrollToCursor = (
  value: string,
  textarea: HTMLTextAreaElement | null,
) => {
  if (!textarea) {
    return;
  }

  const { selectionStart } = textarea;
  const lineHeight = parseInt(
    getComputedStyle(textarea).lineHeight || "20",
    10,
  );
  const lines = value.slice(0, selectionStart).split("\n").length;
  // textarea.scrollTop = (lines - 1) * lineHeight;
  textarea.scrollTo({ top: (lines - 1) * lineHeight, behavior: "smooth" });
};

export const modifyValueByMarkdownSyntax = (
  value: string,
  textAreaRef: RefObject<HTMLTextAreaElement | null>,
) => {
  const textarea = textAreaRef.current;
  if (!textarea) {
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const before = value.slice(0, start);
  const after = value.slice(end);
  const lineStart = before.lastIndexOf("\n") + 1;
  const currentLine = before.slice(lineStart);

  const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s+/);
  const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s+/);

  if (
    (orderedMatch || unorderedMatch) &&
    currentLine.trim().match(/^([-*+]|\d+\.)$/)
  ) {
    const newText = value.slice(0, lineStart) + "\n" + after;

    return {
      newValue: newText,
      newSelectionStart: lineStart + 1,
      newSelectionEnd: lineStart + 1,
    } as const;
  }

  if (orderedMatch) {
    const indent = orderedMatch[1];
    const nextNum = parseInt(orderedMatch[2] ?? "", 10) + 1;
    const insert = `\n${indent}${nextNum}. `;

    return {
      newValue: before + insert + after,
      newSelectionStart: start + insert.length,
      newSelectionEnd: start + insert.length,
    } as const;
  } else if (unorderedMatch) {
    const indent = unorderedMatch[1];
    const bullet = unorderedMatch[2];
    const insert = `\n${indent}${bullet} `;

    const newText = before + insert + after;
    return {
      newValue: newText,
      newSelectionStart: start + insert.length,
      newSelectionEnd: start + insert.length,
    } as const;
  }
};
