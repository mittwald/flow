import React, { type FC } from "react";
import { Button } from "@/components/Button";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import type { MarkdownEditorMode } from "@/components/MarkdownEditor/MarkdownEditor";
import styles from "../MarkdownEditor.module.scss";

interface Props {
  mode: MarkdownEditorMode;
  setMode: (mode: MarkdownEditorMode) => void;
  isDisabled?: boolean;
}

export const ModeButton: FC<Props> = (props) => {
  const { setMode, mode, isDisabled } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const otherMode = mode === "editor" ? "preview" : "editor";

  return (
    <Button
      isDisabled={isDisabled}
      className={styles.modeButton}
      size="s"
      variant="plain"
      color="dark"
      onPress={() => setMode(otherMode)}
    >
      {stringFormatter.format(`mode.${otherMode}`)}
    </Button>
  );
};
