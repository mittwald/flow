import React, { type FC, useRef, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown } from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";

export type MarkdownEditorMode = "editor" | "preview";

export type MarkdownEditorProps = TextAreaProps;

export const MarkdownEditor: FC<MarkdownEditorProps> = (props) => {
  const { isDisabled, children, ...rest } = props;

  const [markdown, setMarkdown] = useState("");
  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <TextArea
      {...rest}
      isDisabled={isDisabled}
      className={clsx(styles.markdownEditor, styles[`mode-${mode}`])}
      ref={textareaRef}
      value={markdown}
      onChange={(v) => setMarkdown(v)}
    >
      <Toolbar
        markdown={markdown}
        setMarkdown={setMarkdown}
        textareaRef={textareaRef}
        setMode={setMode}
        mode={mode}
        isDisabled={isDisabled}
      />

      <Markdown className={styles.markdown}>{markdown}</Markdown>

      {children}
    </TextArea>
  );
};

export default MarkdownEditor;
