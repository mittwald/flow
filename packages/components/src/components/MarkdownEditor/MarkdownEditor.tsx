import React, { useRef, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown } from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { handleKeyDown } from "@/components/MarkdownEditor/lib/handleKeyDown";

export type MarkdownEditorMode = "editor" | "preview";

export type MarkdownEditorProps = TextAreaProps;

/** @flr-generate all */
export const MarkdownEditor = flowComponent("MarkdownEditor", (props) => {
  const {
    isDisabled,
    children,
    className,
    value,
    onChange,
    rows,
    autoResizeMaxRows,
    ...rest
  } = props;

  const [markdown, setMarkdown] = useState(value ?? "");
  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const rootClassName = clsx(
    styles.markdownEditor,
    className,
    styles[`mode-${mode}`],
  );

  return (
    <TextArea
      {...rest}
      isDisabled={isDisabled || mode === "preview"}
      className={rootClassName}
      ref={textAreaRef}
      value={value !== undefined ? value : markdown}
      rows={rows}
      autoResizeMaxRows={autoResizeMaxRows}
      onChange={(v) => {
        if (onChange) {
          onChange(v);
        }
        setMarkdown(v);
      }}
      onKeyDown={(e) => handleKeyDown(e, textAreaRef, setMarkdown, onChange)}
    >
      <Toolbar
        markdown={markdown}
        setMarkdown={setMarkdown}
        textAreaRef={textAreaRef}
        setMode={setMode}
        mode={mode}
        isDisabled={isDisabled}
        onChange={onChange}
      />

      <Markdown
        className={styles.markdown}
        style={{
          maxHeight: `calc(var(--line-height--m) * ${autoResizeMaxRows ?? rows} + (var(--form-control--padding-y) * 2))`,
        }}
      >
        {markdown}
      </Markdown>

      {children}
    </TextArea>
  );
});

export default MarkdownEditor;
