import React, { type FC, type PropsWithChildren, type RefObject } from "react";
import {
  insertAtCursor,
  type InsertType,
} from "@/components/MarkdownEditor/lib/insertAtCursor";
import { Button } from "@/components/Button";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";

interface Props extends PropsWithChildren {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  isDisabled?: boolean;
  type: InsertType;
}

export const ToolbarButton: FC<Props> = (props) => {
  const { markdown, setMarkdown, textareaRef, children, isDisabled, type } =
    props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Button
      isDisabled={isDisabled}
      aria-label={stringFormatter.format(`toolbar.${type}`)}
      size="s"
      variant="plain"
      color="dark"
      onPress={() => insertAtCursor(markdown, setMarkdown, textareaRef, type)}
    >
      {children}
    </Button>
  );
};
