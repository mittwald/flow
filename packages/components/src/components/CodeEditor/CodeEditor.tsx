import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useCallback, useId, useState } from "react";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { joinIds, useFieldComponent } from "@/lib/hooks/useFieldComponent";
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
  /** The initial code of an uncontrolled editor. */
  defaultValue?: string;
  /**
   * Whether the code can be read but not edited.
   *
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Whether the editor is displayed as invalid.
   *
   * @default false
   */
  isInvalid?: boolean;
  /** The elements class name. */
  className?: string;
  /**
   * The language the code is highlighted as. A language the editor does not
   * know is shown as plain text.
   */
  language?: CodeEditorLanguage | (string & {});
  /**
   * Whether a button to copy the code to the clipboard is shown.
   *
   * @default true
   */
  copyable?: boolean;
  /**
   * Whether the field must be filled in. Only marks the editor as required for
   * assistive technology — the editor does not validate itself.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * @internal Set by `<Field />` on every form field. The editor has no
   * react-aria validation to forward it to and drops it.
   */
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
  } = useControlledHostValueProps(props, "");

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    wrapperProps,
    controlProps,
    fieldPropsContext,
  } = useFieldComponent(props, "CodeEditor");

  const rootClassName = clsx(
    wrapperProps.className,
    styles.codeEditor,
    className,
  );

  const labelId = useId();
  const descriptionId = useId();

  /**
   * Both are optional. Their refs tell whether they are rendered, so the editor
   * never references an element that does not exist – a dangling id fails HTML
   * validators and a11y checks. The callbacks are stable: a new one per render
   * would detach and re-attach on every render.
   */
  const [hasLabel, setHasLabel] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const labelRef = useCallback((element: Element | null) => {
    setHasLabel(!!element);
  }, []);
  const descriptionRef = useCallback((element: Element | null) => {
    setHasDescription(!!element);
  }, []);

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
      ref: labelRef,
      tunnel: { id: "label", component: "CodeEditor" },
    },
    FieldDescription: {
      ...fieldPropsContext.FieldDescription,
      id: descriptionId,
      ref: descriptionRef,
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
   * Without a label, an `aria-label` names the editor instead.
   */
  const labelledBy = joinIds(ariaLabelledBy, hasLabel && labelId);
  const describedBy = joinIds(
    hasDescription && descriptionId,
    controlProps["aria-describedby"],
  );

  const contentAttributes = EditorView.contentAttributes.of({
    ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
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
