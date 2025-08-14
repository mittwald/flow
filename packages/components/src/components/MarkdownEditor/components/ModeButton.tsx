import React, { type FC } from "react";
import { Button } from "@/components/Button";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import type { MarkdownEditorMode } from "@/components/MarkdownEditor/MarkdownEditor";

interface Props {
  mode: MarkdownEditorMode;
  setMode: (mode: MarkdownEditorMode) => void;
}

export const ModeButton: FC<Props> = (props) => {
  const { setMode, mode } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const otherMode = mode === "editor" ? "preview" : "editor";

  return (
    <Button
      size="s"
      variant="plain"
      color="dark"
      onPress={() => setMode(otherMode)}
    >
      {stringFormatter.format(`mode.${otherMode}`)}
    </Button>
  );
};
