import type { ReactNode } from "react";
import { type ComponentType, type KeyboardEventHandler, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import {
  Markdown as DefaultMarkdown,
  type MarkdownProps,
} from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import {
  modifyValueByMarkdownSyntax,
  scrollToCursor,
} from "@/components/MarkdownEditor/lib/modifyValueByMarkdownSyntax";
import {
  type InsertType,
  modifyValueByType,
} from "@/components/MarkdownEditor/lib/modifyValueByType";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";

export type MarkdownEditorMode = "editor" | "preview";

export interface MarkdownEditorCustomToolContext {
  value: string;
  textarea: HTMLTextAreaElement | null;
  setValue: (
    newValue: string,
    newSelectionStart?: number,
    newSelectionEnd?: number,
  ) => void;
}

export interface MarkdownEditorCustomTool {
  id: string;
  label: string;
  icon: ReactNode;
  isDisabled?: boolean;
  onPress: (context: MarkdownEditorCustomToolContext) => void;
}

export interface MarkdownEditorProps
  extends TextAreaProps, Pick<MarkdownProps, "headingOffset"> {
  /**
   * Allows replacing the markdown preview renderer implementation. Defaults to
   * the internal `Markdown` component.
   */
  markdownComponent?: ComponentType<MarkdownProps>;
  toolbarTools?: MarkdownEditorCustomTool[];
}

/**
 * @flr-generate all
 * @flr-ignore-props toolbarTools
 */
export const MarkdownEditor = flowComponent("MarkdownEditor", (props) => {
  const {
    isDisabled,
    isReadOnly,
    children,
    className,
    rows = 5,
    autoResizeMaxRows,
    headingOffset,
    markdownComponent: MarkdownComponent = DefaultMarkdown,
    toolbarTools = [],
    value,
    onChange,
    ref,
    ...rest
  } = useControlledHostValueProps(props);

  const inputRef = useObjectRef(ref);
  const [mode, setMode] = useState<MarkdownEditorMode>("editor");

  const rootClassName = clsx(
    styles.markdownEditor,
    styles[`mode-${mode}`],
    className,
  );

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    const modifyParams = modifyValueByMarkdownSyntax(value, inputRef);
    if (!modifyParams) {
      return;
    }

    const { newValue, newSelectionStart, newSelectionEnd } = modifyParams;

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = newValue;
        inputRef.current?.setSelectionRange(newSelectionStart, newSelectionEnd);
        scrollToCursor(newValue, inputRef.current);
      }
    });

    event.preventDefault();
    onChange(newValue);
  };

  const handleToolButtonPressed = (type: InsertType) => {
    const { newValue, newSelectionStart, newSelectionEnd } = modifyValueByType(
      value,
      type,
      inputRef,
    );

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = newValue;
        inputRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
        inputRef.current.focus();
      }
    });

    onChange(newValue);
  };

  const handleCustomToolPressed = (tool: MarkdownEditorCustomTool) => {
    tool.onPress({
      value: value ?? "",
      textarea: inputRef.current,
      setValue: (newValue, newSelectionStart, newSelectionEnd) => {
        const defaultSelectionStart =
          inputRef.current?.selectionStart ?? newValue.length;
        const selectionStart = newSelectionStart ?? defaultSelectionStart;
        const selectionEnd = newSelectionEnd ?? selectionStart;

        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.value = newValue;
            inputRef.current.setSelectionRange(selectionStart, selectionEnd);
            inputRef.current.focus();
          }
        });

        onChange(newValue);
      },
    });
  };

  return (
    <div className={rootClassName}>
      <TextArea
        {...rest}
        aria-hidden={mode === "preview"}
        isReadOnly={isReadOnly || mode === "preview"}
        isDisabled={isDisabled}
        ref={inputRef}
        value={value}
        rows={rows}
        autoResizeMaxRows={autoResizeMaxRows}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      >
        {mode === "preview" && (
          <MarkdownComponent
            headingOffset={headingOffset}
            className={styles.markdown}
            style={{
              height: inputRef.current?.offsetHeight,
            }}
          >
            {value}
          </MarkdownComponent>
        )}
        {children}
        <Toolbar
          currentMode={mode}
          isDisabled={isDisabled}
          onModeChange={setMode}
          onToolPressed={handleToolButtonPressed}
          customTools={toolbarTools}
          onCustomToolPressed={handleCustomToolPressed}
        />
      </TextArea>
    </div>
  );
});

export default MarkdownEditor;
