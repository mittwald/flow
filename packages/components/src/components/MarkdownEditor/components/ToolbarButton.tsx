import React, { type FC, type PropsWithChildren, type RefObject } from "react";
import {
  insertAtCursor,
  type InsertType,
} from "@/components/MarkdownEditor/lib/insertAtCursor";
import { Button } from "@/components/Button";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import type { MarkdownEditorMode } from "@/components/MarkdownEditor/MarkdownEditor";

interface Props extends PropsWithChildren {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  textAreaRef: RefObject<HTMLTextAreaElement | null>;
  isDisabled?: boolean;
  type: InsertType;
  onChange?: (markdown: string) => void;
  mode: MarkdownEditorMode;
}

export const ToolbarButton: FC<Props> = (props) => {
  const {
    markdown,
    setMarkdown,
    textAreaRef,
    children,
    isDisabled,
    type,
    onChange,
    mode,
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Button
      isDisabled={isDisabled || mode === "preview"}
      aria-label={stringFormatter.format(`toolbar.${type}`)}
      size="s"
      variant="plain"
      color="dark"
      onPress={() =>
        insertAtCursor(markdown, setMarkdown, textAreaRef, type, onChange)
      }
    >
      {children}
    </Button>
  );
};
