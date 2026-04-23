import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import styles from "./CodeEditor.module.scss";
import { type CodeEditorLanguage } from "@/components/CodeEditor/languages";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useObjectRef } from "react-aria";
import { defaultLightTheme } from "@/components/CodeEditor/themes/defaultEditorTheme";
import {
  type CodeEditorSetup,
  useCodeEditorExtensions,
} from "@/components/CodeEditor/hooks/useCodeEditorExtensions";
import { CopyButton } from "@/components/CopyButton";
import React from "react";

export interface CodeEditorProps
  extends
    Omit<ReactCodeMirrorProps, "theme" | "lang" | "basicSetup" | "readOnly">,
    CodeEditorSetup,
    FlowComponentProps {
  defaultValue?: string;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  className?: string;
  language?: CodeEditorLanguage;
  copyable?: boolean;
  isRequired?: boolean;
  validationBehavior?: unknown;
}

/** @flr-generate all */
export const CodeEditor = flowComponent("CodeEditor", (props) => {
  const {
    ref,
    children,
    className,
    language,
    extensions,
    isReadOnly,
    isInvalid,
    isRequired,
    validationBehavior: _ignoredValidationBehavior,
    value,
    showLineNumbers = true,
    showCodeFolding = true,
    showCodeIndentationMakers = true,
    showLinterMarkers = true,
    showActiveLineMarker = true,
    copyable = true,
    ...rest
  } = useControlledHostValueProps(props);

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props);

  const rootClassName = clsx(
    fieldProps.className,
    styles.codeEditor,
    className,
  );

  const enabledExtensions = useCodeEditorExtensions(language, extensions, {
    showLineNumbers: showLineNumbers,
    showCodeIndentationMakers: showCodeIndentationMakers,
    showCodeFolding: showCodeFolding,
    showLinterMarkers: showLinterMarkers,
  });

  const localRef = useObjectRef(ref);
  useMakeFocusable(localRef);

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={fieldPropsContext}>
        <FieldErrorCaptureContext>
          <CodeMirror
            {...rest}
            value={value}
            basicSetup={{
              highlightActiveLine: showActiveLineMarker,
              highlightActiveLineGutter: showActiveLineMarker,
              autocompletion: false,
              lineNumbers: false,
              foldGutter: false,
              highlightSelectionMatches: false,
            }}
            theme={defaultLightTheme}
            aria-required={isRequired}
            aria-invalid={isInvalid}
            readOnly={isReadOnly}
            className={clsx(styles.codeMirror, isReadOnly && styles.readonly)}
            ref={(codeMirrorRef) => {
              if (codeMirrorRef?.editor) {
                localRef.current = codeMirrorRef.editor;
              }
            }}
            extensions={enabledExtensions}
          >
            {copyable && (
              <CopyButton
                className={styles.copyButton}
                size="s"
                variant="soft"
                text={value}
              />
            )}
          </CodeMirror>
          {children}
        </FieldErrorCaptureContext>
        <FieldErrorView />
      </PropsContextProvider>
    </div>
  );
});

export default CodeEditor;
