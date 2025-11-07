import React, { type RefObject, useEffect, useRef, useState } from "react";
import styles from "./MarkdownEditor.module.scss";
import { Markdown, type MarkdownProps } from "@/components/Markdown";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { Toolbar } from "@/components/MarkdownEditor/components/Toolbar";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { useManagedValue } from "@/lib/hooks/useManagedValue";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelProvider, TunnelExit } from "@mittwald/react-tunnel";
import {
  modifyValueByMarkdownSyntax,
  scrollToCursor,
} from "@/components/MarkdownEditor/lib/modifyValueByMarkdownSyntax";
import { modifyValueByType } from "@/components/MarkdownEditor/lib/modifyValueByType";

export type MarkdownEditorMode = "editor" | "preview";

export type MarkdownEditorProps = Omit<TextAreaProps, "ref"> &
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
  const localInputRef = useObjectRef(inputRef);

  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const { value, handleOnChange } = useManagedValue(props);

  const selectionPresent = useRef<{
    shouldScrollToCursor: boolean;
    selectionStart: number | null;
    selectionEnd: number | null;
  } | null>(null);

  useEffect(() => {
    const inputRef = localInputRef.current;
    const present = selectionPresent.current;

    if (!present || !inputRef) {
      return;
    }

    setTimeout(() => {
      requestAnimationFrame(() => {
        inputRef.setSelectionRange(
          present.selectionStart,
          present.selectionEnd,
        );
        inputRef.focus();

        if (present.shouldScrollToCursor) {
          scrollToCursor(value, inputRef);
        }
      });

      selectionPresent.current = null;
    }, 0);
  }, [selectionPresent.current, localInputRef.current, value]);

  const rootClassName = clsx(
    styles.markdownEditor,
    className,
    styles[`mode-${mode}`],
  );

  return (
    <div ref={localRef} className={rootClassName}>
      <TunnelProvider>
        <TunnelExit id="label" />
        <TextArea
          {...rest}
          aria-hidden={mode === "preview"}
          isReadOnly={isReadOnly || mode === "preview"}
          isDisabled={isDisabled}
          ref={localInputRef}
          value={value}
          rows={rows}
          autoResizeMaxRows={autoResizeMaxRows}
          onChange={handleOnChange}
          onKeyDown={(event) => {
            if (event.key !== "Enter") {
              return;
            }

            const modifyParams = modifyValueByMarkdownSyntax(
              value,
              localInputRef,
            );

            if (!modifyParams) {
              return;
            }

            const { newValue, newSelectionStart, newSelectionEnd } =
              modifyParams;

            event.preventDefault();
            localInputRef.current?.blur();

            selectionPresent.current = {
              shouldScrollToCursor: true,
              selectionStart: newSelectionStart,
              selectionEnd: newSelectionEnd,
            };

            handleOnChange(newValue);
          }}
        >
          <Toolbar
            currentMode={mode}
            isDisabled={isDisabled}
            onModeChange={setMode}
            onToolPressed={(type) => {
              const { newValue, newSelectionStart, newSelectionEnd } =
                modifyValueByType(value, type, localInputRef);

              selectionPresent.current = {
                shouldScrollToCursor: false,
                selectionStart: newSelectionStart,
                selectionEnd: newSelectionEnd,
              };

              handleOnChange(newValue);
            }}
          />
          <Markdown
            headingOffset={headingOffset}
            className={styles.markdown}
            style={{
              height: localInputRef.current?.offsetHeight,
            }}
          >
            {value}
          </Markdown>
          <PropsContextProvider
            props={{
              Label: {
                tunnelId: "label",
              },
            }}
          >
            {children}
          </PropsContextProvider>
        </TextArea>
      </TunnelProvider>
    </div>
  );
});

export default MarkdownEditor;
