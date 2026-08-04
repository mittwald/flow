import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useId } from "react";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
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
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

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

/**
 * @flr-generate all
 * @flowStatus new
 */
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
    height,
    minHeight,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = useControlledHostValueProps(props);

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props, "CodeEditor");

  const rootClassName = clsx(
    fieldProps.className,
    styles.codeEditor,
    className,
  );

  const labelId = useId();
  const descriptionId = useId();

  /**
   * The label and the field description are declared as children of the code
   * editor, but must be rendered outside of the editor itself. They are
   * tunneled out of the editor – just like the field error. Their ids are the
   * ones the editor references.
   */
  const propsContext: PropsContext = {
    ...fieldPropsContext,
    Label: {
      ...fieldPropsContext.Label,
      id: labelId,
      tunnel: { id: "label", component: "CodeEditor" },
    },
    FieldDescription: {
      ...fieldPropsContext.FieldDescription,
      id: descriptionId,
      tunnel: { id: "fieldDescription", component: "CodeEditor" },
    },
  };

  const enabledExtensions = useCodeEditorExtensions(language, extensions, {
    showLineNumbers: showLineNumbers,
    showCodeIndentationMakers: showCodeIndentationMakers,
    showCodeFolding: showCodeFolding,
    showLinterMarkers: showLinterMarkers,
  });

  /**
   * The editable element of CodeMirror is the `.cm-content` element – not the
   * root element the props are applied to. Its ARIA attributes are set through
   * the content attributes facet.
   *
   * The label reference only resolves when a label is given. Without one, an
   * `aria-label` names the editor instead – the name computation skips
   * references that point at nothing.
   */
  const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(" ");

  const describedBy =
    [descriptionId, fieldProps["aria-describedby"]].filter(Boolean).join(" ") ||
    undefined;

  const contentAttributes = EditorView.contentAttributes.of({
    "aria-labelledby": labelledBy,
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(isRequired ? { "aria-required": "true" } : {}),
    ...(isInvalid ? { "aria-invalid": "true" } : {}),
  });

  const localRef = useObjectRef(ref);

  useMakeFocusable(localRef);

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <UiComponentTunnelExit id="label" component="CodeEditor" />
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
            data-invalid={isInvalid || undefined}
            readOnly={isReadOnly}
            className={clsx(styles.codeMirror, isReadOnly && styles.readonly)}
            ref={(codeMirrorRef) => {
              if (codeMirrorRef?.editor) {
                localRef.current = codeMirrorRef.editor;
              }
            }}
            extensions={[...enabledExtensions, contentAttributes]}
            height={height ?? minHeight}
          >
            {copyable && (
              <CopyButton
                className={styles.copyButton}
                size="s"
                variant="soft"
                text={value}
              />
            )}
            {children}
          </CodeMirror>
        </FieldErrorCaptureContext>
        <UiComponentTunnelExit id="fieldDescription" component="CodeEditor" />
        <FieldErrorView />
      </PropsContextProvider>
    </div>
  );
});

export default CodeEditor;
