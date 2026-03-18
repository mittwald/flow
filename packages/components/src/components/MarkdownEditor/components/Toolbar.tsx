import React, { type FC } from "react";
import styles from "@/components/MarkdownEditor/MarkdownEditor.module.scss";
import {
  IconBold,
  IconCode,
  IconItalic,
  IconLink,
  IconOrderedList,
  IconQuote,
  IconStrikeThrough,
  IconUnorderedList,
} from "@/components/Icon/components/icons";
import {
  ToolbarButton,
  type ToolBarButtonProps,
} from "@/components/MarkdownEditor/components/ToolbarButton";
import {
  ModeButton,
  type ModeButtonProps,
} from "@/components/MarkdownEditor/components/ModeButton";
import type { ButtonProps } from "@/components/Button";

interface ToolbarProps extends Pick<ButtonProps, "isDisabled"> {
  currentMode: ModeButtonProps["currentMode"];
  onModeChange: ModeButtonProps["onChange"];
  onToolPressed: ToolBarButtonProps["onPress"];
}

export const Toolbar: FC<ToolbarProps> = (props) => {
  const sharedToolButtonProps: Partial<ToolBarButtonProps> = {
    onPress: props.onToolPressed,
    isDisabled: props.isDisabled || props.currentMode === "preview",
  };

  return (
    <div className={styles.toolbar} role="toolbar">
      <div className={styles.toolbarButtons}>
        <ToolbarButton {...sharedToolButtonProps} type="bold">
          <IconBold />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="italic">
          <IconItalic />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="strikeThrough">
          <IconStrikeThrough />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="quote">
          <IconQuote />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="code">
          <IconCode />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="link">
          <IconLink />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="unorderedList">
          <IconUnorderedList />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="orderedList">
          <IconOrderedList />
        </ToolbarButton>
      </div>

      <ModeButton
        onChange={props.onModeChange}
        currentMode={props.currentMode}
        isDisabled={props.isDisabled}
      />
    </div>
  );
};
