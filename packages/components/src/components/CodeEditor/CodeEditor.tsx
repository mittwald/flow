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
import { useCodeEditorExtensions } from "@/components/CodeEditor/hooks/useCodeEditorExtensions";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useObjectRef } from "react-aria";

export interface CodeEditorProps
  extends ReactCodeMirrorProps, FlowComponentProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  className?: string;
  language?: CodeEditorLanguage;
}

/** @flr-generate all */
export const CodeEditor = flowComponent("CodeEditor", (props) => {
  const { ref, children, className, language, extensions, ...rest } =
    useControlledHostValueProps(props);

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

  const enabledExtensions = useCodeEditorExtensions(language, extensions);

  const localRef = useObjectRef(ref);
  useMakeFocusable(localRef);

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={fieldPropsContext}>
        <FieldErrorCaptureContext>
          <CodeMirror
            {...rest}
            className={styles.codeMirror}
            ref={(codeMirrorRef) => {
              if (codeMirrorRef?.editor) {
                localRef.current = codeMirrorRef.editor;
              }
            }}
            extensions={enabledExtensions}
          />
          {children}
        </FieldErrorCaptureContext>
        <FieldErrorView />
      </PropsContextProvider>
    </div>
  );
});

export default CodeEditor;
