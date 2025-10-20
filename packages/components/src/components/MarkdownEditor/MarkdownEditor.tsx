import React, { useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown, type MarkdownProps } from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { handleKeyDown } from "@/components/MarkdownEditor/lib/handleKeyDown";
import { useObjectRef } from "@react-aria/utils";
import { useManagedValue } from "@/lib/hooks/useManagedValue";
import { insertAtCursor } from "@/components/MarkdownEditor/lib/insertAtCursor";

export type MarkdownEditorMode = "editor" | "preview";

export type MarkdownEditorProps = TextAreaProps &
  Pick<MarkdownProps, "headingOffset">;

/** @flr-generate all */
export const MarkdownEditor = flowComponent("MarkdownEditor", (props) => {
  const {
    isDisabled,
    isReadOnly,
    children,
    className,
    rows = 5,
    autoResizeMaxRows,
    headingOffset,
    ref,
    ...rest
  } = props;

  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const { value, handleOnChange } = useManagedValue(props);
  const textAreaRef = useObjectRef<HTMLTextAreaElement>(ref);

  const rootClassName = clsx(
    styles.markdownEditor,
    className,
    styles[`mode-${mode}`],
  );

  const verticallyResizable = props.allowResize || props.allowVerticalResize;

  return (
    <TextArea
      {...rest}
      isReadOnly={isReadOnly || mode === "preview"}
      isDisabled={isDisabled}
      className={rootClassName}
      ref={textAreaRef}
      value={value}
      rows={rows}
      autoResizeMaxRows={autoResizeMaxRows}
      onChange={(v) => {
        handleOnChange(v);
      }}
      onKeyDown={(e) => handleKeyDown(e, textAreaRef, handleOnChange)}
    >
      <Toolbar
        currentMode={mode}
        isDisabled={isDisabled}
        onModeChange={(newMode) => setMode(newMode)}
        onToolPressed={(type) => {
          insertAtCursor(value, handleOnChange, textAreaRef, type);
        }}
      />

      <Markdown
        headingOffset={headingOffset}
        className={styles.markdown}
        style={{
          maxHeight: verticallyResizable
            ? undefined
            : `calc(var(--line-height--m) * ${autoResizeMaxRows ?? rows} + (var(--form-control--padding-y) * 2))`,
        }}
      >
        {value}
      </Markdown>

      {children}
    </TextArea>
  );
});

export default MarkdownEditor;
