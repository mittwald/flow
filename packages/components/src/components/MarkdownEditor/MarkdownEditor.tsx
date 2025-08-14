import React, { useEffect, useRef, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown } from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export type MarkdownEditorMode = "editor" | "preview";

export type MarkdownEditorProps = TextAreaProps;

export const MarkdownEditor = flowComponent("MarkdownEditor", (props) => {
  const { isDisabled, children, className, value, onChange, ...rest } = props;

  const [markdown, setMarkdown] = useState(value ?? "");
  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rootClassName = clsx(
    styles.markdownEditor,
    className,
    styles[`mode-${mode}`],
  );

  useEffect(() => {
    if (onChange) {
      onChange(markdown);
    }
  }, [markdown]);

  return (
    <TextArea
      {...rest}
      isDisabled={isDisabled}
      className={rootClassName}
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
});

export default MarkdownEditor;
