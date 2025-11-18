import React, { type KeyboardEvent, type RefObject, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown, type MarkdownProps } from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { useManagedValue } from "@/lib/hooks/useManagedValue";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { TunnelProvider, TunnelExit } from "@mittwald/react-tunnel";
import {
  modifyValueByMarkdownSyntax,
  scrollToCursor,
} from "@/components/MarkdownEditor/lib/modifyValueByMarkdownSyntax";
import {
  type InsertType,
  modifyValueByType,
} from "@/components/MarkdownEditor/lib/modifyValueByType";

export type MarkdownEditorMode = "editor" | "preview";

export type MarkdownEditorProps = Omit<TextAreaProps, "ref" | "inputContext"> &
  Pick<MarkdownProps, "headingOffset" | "ref"> & {
    inputRef?: RefObject<HTMLTextAreaElement | null>;
  };

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
    inputRef,
    ...rest
  } = props;

  const localRef = useObjectRef(ref);
  const localTextAreaRef = useObjectRef(inputRef);

  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const { value, handleOnChange } = useManagedValue(props);

  const rootClassName = clsx(
    styles.markdownEditor,
    className,
    styles[`mode-${mode}`],
  );

  const forceApplyValue = (
    newValue: string,
    newSelectionStart: number,
    newSelectionEnd: number,
  ) => {
    if (localTextAreaRef.current) {
      // we have to apply the value here by ref
      // otherwise the calcucation of the scroll position
      // would be off because the onChange must bubble trough
      localTextAreaRef.current.value = newValue;
      localTextAreaRef.current.selectionStart = newSelectionStart;
      localTextAreaRef.current.selectionEnd = newSelectionEnd;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    const modifyParams = modifyValueByMarkdownSyntax(value, localTextAreaRef);
    if (!modifyParams) {
      return;
    }

    const { newValue, newSelectionStart, newSelectionEnd } = modifyParams;

    forceApplyValue(newValue, newSelectionStart, newSelectionEnd);
    scrollToCursor(newValue, localTextAreaRef.current);

    event.preventDefault();
    handleOnChange(newValue);
  };

  const handleToolButtonPressed = (type: InsertType) => {
    const { newValue, newSelectionStart, newSelectionEnd } = modifyValueByType(
      value,
      type,
      localTextAreaRef,
    );

    forceApplyValue(newValue, newSelectionStart, newSelectionEnd);
    handleOnChange(newValue);
    localTextAreaRef.current?.focus();
  };

  const propsContext: PropsContext = {
    Label: {
      tunnelId: "label",
    },
  };

  return (
    <div ref={localRef} className={rootClassName}>
      <TunnelProvider>
        <TunnelExit id="label" />
        <Toolbar
          currentMode={mode}
          isDisabled={isDisabled}
          onModeChange={setMode}
          onToolPressed={handleToolButtonPressed}
        />
        <TextArea
          {...rest}
          aria-hidden={mode === "preview"}
          isReadOnly={isReadOnly || mode === "preview"}
          isDisabled={isDisabled}
          ref={localTextAreaRef}
          value={value}
          rows={rows}
          autoResizeMaxRows={autoResizeMaxRows}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
        >
          <Markdown
            headingOffset={headingOffset}
            className={styles.markdown}
            style={{
              height: localTextAreaRef.current?.offsetHeight,
            }}
          >
            {value}
          </Markdown>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </TextArea>
      </TunnelProvider>
    </div>
  );
});

export default MarkdownEditor;
