import React, { type FC } from "react";
import { Button, type ButtonProps } from "@/components/Button";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import type { MarkdownEditorMode } from "@/components/MarkdownEditor/MarkdownEditor";
import styles from "../MarkdownEditor.module.scss";

export interface ModeButtonProps extends Pick<ButtonProps, "isDisabled"> {
  currentMode: MarkdownEditorMode;
  onModeChange?: (newMode: MarkdownEditorMode) => void;
}

export const ModeButton: FC<ModeButtonProps> = (props) => {
  const { currentMode, onModeChange, ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);
  const otherMode = currentMode === "editor" ? "preview" : "editor";

  return (
    <Button
      className={styles.modeButton}
      size="s"
      variant="plain"
      color="dark"
      onPress={() => {
        onModeChange?.(otherMode);
      }}
      {...rest}
    >
      {stringFormatter.format(`mode.${otherMode}`)}
    </Button>
  );
};
