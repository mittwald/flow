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

export const insertAtCursor = (
  markdown: string,
  setMarkdown: (markdown: string) => void,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  type: InsertType,
) => {
  const textarea = textareaRef.current;
  if (!textarea) return;

  let before = "";
  let after = "";
  let isToggleable = false;

  switch (type) {
    case "bold":
      before = "**";
      after = "**";
      isToggleable = true;
      break;
    case "italic":
      before = "*";
      after = "*";
      isToggleable = true;
      break;
    case "strikeThrough":
      before = "~~";
      after = "~~";
      isToggleable = true;
      break;
    case "quote":
      before = ">";
      break;
    case "code":
      before = "`";
      after = "`";
      break;
    case "link":
      before = "[";
      after = "](https://)";
      break;
    case "unorderedList":
      before = "- ";
      break;
    case "orderedList":
      before = "1. ";
      break;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = markdown.substring(start, end);
  const lines = selectedText.split("\n");
  const isWrapped =
    selectedText.startsWith(before) && selectedText.endsWith(after);

  let newText: string;
  let cursorPosition = 0;

  if (type === "code" && selectedText.includes("\n")) {
    newText =
      markdown.substring(0, start) +
      "```\n" +
      selectedText +
      "\n```\n" +
      markdown.substring(end);
    cursorPosition = start + 4 + selectedText.length;
  } else if (type === "orderedList") {
    const numbered = lines.map((line, i) => `${i + 1}. ${line}`).join("\n");
    newText = markdown.substring(0, start) + numbered + markdown.substring(end);
    cursorPosition = start + numbered.length;
  } else if (type === "unorderedList") {
    const bulleted = lines.map((line) => `- ${line}`).join("\n");
    newText = markdown.substring(0, start) + bulleted + markdown.substring(end);
    cursorPosition = start + bulleted.length;
  } else if (isToggleable && isWrapped) {
    const unwrapped = selectedText.slice(
      before.length,
      selectedText.length - after.length,
    );
    newText =
      markdown.substring(0, start) + unwrapped + markdown.substring(end);
    cursorPosition = start + unwrapped.length;
  } else {
    newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);
    cursorPosition = start + before.length + selectedText.length + after.length;
  }

  setMarkdown(newText);

  setTimeout(() => {
    textarea.setSelectionRange(cursorPosition, cursorPosition);
    textarea.focus();
  }, 0);
};
