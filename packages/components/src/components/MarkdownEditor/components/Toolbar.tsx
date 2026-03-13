import React, { type FC } from "react";
import styles from "@/components/MarkdownEditor/MarkdownEditor.module.scss";
import { Icon } from "@/components/Icon";
import {
  IconBlockquote,
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconStrikethrough,
} from "@tabler/icons-react";
import { IconCode, IconLink } from "@/components/Icon/components/icons";
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
          <Icon>
            <IconBold />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="italic">
          <Icon>
            <IconItalic />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="strikeThrough">
          <Icon>
            <IconStrikethrough />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="quote">
          <Icon>
            <IconBlockquote />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="code">
          <IconCode />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="link">
          <IconLink />
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="unorderedList">
          <Icon>
            <IconList />
          </Icon>
        </ToolbarButton>

        <ToolbarButton {...sharedToolButtonProps} type="orderedList">
          <Icon>
            <IconListNumbers />
          </Icon>
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
