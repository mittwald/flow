import { type KeyboardEventHandler, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown, type MarkdownProps } from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
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

export interface MarkdownEditorProps
  extends TextAreaProps,
    Pick<MarkdownProps, "headingOffset"> {}

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
    value,
    onChange,
    ref,
    ...rest
  } = useControlledHostValueProps(props);

  const inputRef = useObjectRef(ref);
  const [mode, setMode] = useState<MarkdownEditorMode>("editor");

  const rootClassName = clsx(
    styles.markdownEditor,
    className,
    styles[`mode-${mode}`],
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

  const propsContext: PropsContext = {
    Label: {
      tunnelId: "label",
    },
  };

  return (
    <div className={rootClassName}>
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
          ref={inputRef}
          value={value}
          rows={rows}
          autoResizeMaxRows={autoResizeMaxRows}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        >
          <Markdown
            headingOffset={headingOffset}
            className={styles.markdown}
            style={{
              height: inputRef.current?.offsetHeight,
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
