import type { KeyboardEvent, RefObject } from "react";

const scrollToCursor = (textarea: HTMLTextAreaElement) => {
  const { selectionStart } = textarea;
  const lineHeight = parseInt(
    getComputedStyle(textarea).lineHeight || "20",
    10,
  );
  const lines = textarea.value.slice(0, selectionStart).split("\n").length;
  textarea.scrollTop = (lines - 1) * lineHeight;
};

export const handleKeyDown = (
  e: KeyboardEvent,
  textAreaRef: RefObject<HTMLTextAreaElement | null>,
  setMarkdown: (markdown: string) => void,
  onChange?: (markdown: string) => void,
) => {
  if (e.key !== "Enter") return;

  const textarea = textAreaRef.current;

  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

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
    e.preventDefault();
    const newText = value.slice(0, lineStart) + "\n" + after;

    setMarkdown(newText);

    if (onChange) {
      onChange(newText);
    }

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = lineStart + 1;
      scrollToCursor(textarea);
    });
    return;
  }

  if (orderedMatch) {
    e.preventDefault();
    const indent = orderedMatch[1];
    const nextNum = parseInt(orderedMatch[2] ?? "", 10) + 1;
    const insert = `\n${indent}${nextNum}. `;

    const newText = before + insert + after;

    setMarkdown(newText);

    if (onChange) {
      onChange(newText);
    }

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + insert.length;
      scrollToCursor(textarea);
    });
  } else if (unorderedMatch) {
    e.preventDefault();
    const indent = unorderedMatch[1];
    const bullet = unorderedMatch[2];
    const insert = `\n${indent}${bullet} `;

    const newText = before + insert + after;

    setMarkdown(newText);

    if (onChange) {
      onChange(newText);
    }

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + insert.length;
      scrollToCursor(textarea);
    });
  }
};
