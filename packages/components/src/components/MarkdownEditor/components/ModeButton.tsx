import { type FC } from "react";
import { Button, type ButtonProps } from "@/components/Button";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../locales/*.locale.json";
import type { MarkdownEditorMode } from "@/components/MarkdownEditor/MarkdownEditor";
import styles from "../MarkdownEditor.module.scss";
import { ClearPropsContext } from "@/components/ClearPropsContext";

export interface ModeButtonProps extends Pick<ButtonProps, "isDisabled"> {
  currentMode: MarkdownEditorMode;
  onChange?: (newMode: MarkdownEditorMode) => void;
}

export const ModeButton: FC<ModeButtonProps> = (props) => {
  const { currentMode, onChange, ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(
    locales,
    "MarkdownEditor",
  );
  const otherMode = currentMode === "editor" ? "preview" : "editor";

  return (
    <ClearPropsContext>
      <Button
        tunnel={null}
        className={styles.modeButton}
        size="s"
        variant="plain"
        color="dark"
        onPress={() => {
          onChange?.(otherMode);
        }}
        {...rest}
      >
        {stringFormatter.format(`mode.${otherMode}`)}
      </Button>
    </ClearPropsContext>
  );
};
