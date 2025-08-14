import React, { type FC, useRef, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown } from "@/components/Markdown";
import { TextArea } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";

export type MarkdownEditorMode = "editor" | "preview";

export interface MarkdownEditorProps {
  /* Whether the markdown editor is disabled */
  isDisabled?: boolean;
}

export const MarkdownEditor: FC<MarkdownEditorProps> = (props) => {
  const { isDisabled } = props;

  const [markdown, setMarkdown] = useState("");
  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      className={clsx(styles.markdownEditor, styles[`mode-${mode}`])}
      aria-disabled={isDisabled}
    >
      <Toolbar
        markdown={markdown}
        setMarkdown={setMarkdown}
        textareaRef={textareaRef}
        setMode={setMode}
        mode={mode}
        isDisabled={isDisabled}
      />
      <div className={styles.content}>
        <TextArea
          isDisabled={isDisabled}
          className={styles.textArea}
          ref={textareaRef}
          value={markdown}
          onChange={(v) => setMarkdown(v)}
        />
        <Markdown className={styles.markdown}>{markdown}</Markdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;
