import React, { type FC, type RefObject } from "react";
import styles from "@/components/MarkdownEditor/MarkdownEditor.module.scss";
import { Icon } from "@/components/Icon";
import {
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconQuoteFilled,
  IconStrikethrough,
} from "@tabler/icons-react";
import { IconCode, IconLink } from "@/components/Icon/components/icons";
import { ToolbarButton } from "@/components/MarkdownEditor/components/ToolbarButton";
import type { MarkdownEditorMode } from "@/components/MarkdownEditor/MarkdownEditor";
import { ModeButton } from "@/components/MarkdownEditor/components/ModeButton";

interface Props {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  setMode: (mode: MarkdownEditorMode) => void;
  mode: MarkdownEditorMode;
}

export const Toolbar: FC<Props> = (props) => {
  const { setMode, mode, ...rest } = props;

  return (
    <header className={styles.toolbar}>
      <div className={styles.toolbarButtons}>
        <ToolbarButton {...rest} type="bold">
          <Icon>
            <IconBold />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...rest} type="italic">
          <Icon>
            <IconItalic />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...rest} type="strikeThrough">
          <Icon>
            <IconStrikethrough />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...rest} type="quote">
          <Icon>
            <IconQuoteFilled />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...rest} type="code">
          <IconCode />
        </ToolbarButton>

        <ToolbarButton {...rest} type="link">
          <IconLink />
        </ToolbarButton>

        <ToolbarButton {...rest} type="unorderedList">
          <Icon>
            <IconList />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...rest} type="orderedList">
          <Icon>
            <IconListNumbers />
          </Icon>
        </ToolbarButton>
      </div>
      <ModeButton setMode={setMode} mode={mode} />
    </header>
  );
};
