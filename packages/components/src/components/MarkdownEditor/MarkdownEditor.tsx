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
import type { MarkdownEditorUpload } from "@/components/MarkdownEditor/lib/fileUpload";
import { useFileUpload } from "@/components/MarkdownEditor/lib/useFileUpload";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import {
  overlayTriggersTunneledTo,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";

export type MarkdownEditorMode = "editor" | "preview";

export type { MarkdownEditorUpload };

const toolbarActionsTunnel = {
  id: "toolbarActions",
  component: "MarkdownEditor",
} as const;

export interface MarkdownEditorProps
  extends TextAreaProps, Pick<MarkdownProps, "headingOffset"> {
  /**
   * Allows replacing the markdown preview renderer implementation. Defaults to
   * the internal `Markdown` component.
   */
  markdownComponent?: ComponentType<MarkdownProps>;
  /**
   * Uploads a file the user dropped onto the editor, pasted into it or picked
   * with its attachment button. A placeholder comment sits at the cursor while
   * the returned promise is pending: resolving replaces it with markdown
   * linking to the file — an image embed for an image — and rejecting takes it
   * back out. Without this prop the editor takes no files at all.
   *
   * Named without an `on` prefix on purpose: the remote generator turns an
   * `on*` prop into a fire-and-forget event, and this one has to hand a result
   * back.
   */
  uploadFile?: (file: File) => Promise<MarkdownEditorUpload>;
  /**
   * Which file types the editor takes, as the `accept` attribute of a file
   * input: a comma separated list of MIME types (`image/png`), MIME wildcards
   * (`image/*`) and file extensions (`.png`). Defaults to every type.
   */
  accept?: string;
}

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
    markdownComponent: MarkdownComponent = DefaultMarkdown,
    value,
    onChange,
    uploadFile,
    accept,
    ref,
    ...rest
  } = useControlledHostValueProps(props, "");

  const inputRef = useObjectRef(ref);
  const [mode, setMode] = useState<MarkdownEditorMode>("editor");
  const toolbarActionsDisabled = isDisabled || mode === "preview";

  const { dropProps, isDropTarget, uploadFiles } = useFileUpload({
    accept,
    uploadFile,
    isDisabled: isDisabled || isReadOnly || mode === "preview",
    value,
    onChange,
    textAreaRef: inputRef,
  });

  const rootClassName = clsx(
    styles.markdownEditor,
    styles[`mode-${mode}`],
    isDropTarget && styles.dropTarget,
    className,
  );

  const toolbarActionsPropsContext: PropsContext = {
    ...overlayTriggersTunneledTo(toolbarActionsTunnel),
    Button: {
      tunnel: toolbarActionsTunnel,
      size: "s",
      variant: "plain",
      color: "dark",
      isDisabled: toolbarActionsDisabled,
    },
  };

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

  return (
    <div {...dropProps} className={rootClassName}>
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
        <PropsContextProvider
          props={toolbarActionsPropsContext}
          dependencies={[toolbarActionsDisabled]}
        >
          {children}
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
          <Toolbar
            currentMode={mode}
            isDisabled={isDisabled}
            onModeChange={setMode}
            onToolPressed={handleToolButtonPressed}
            accept={accept}
            isReadOnly={isReadOnly}
            onFilesSelected={uploadFiles}
          />
        </PropsContextProvider>
      </TextArea>
    </div>
  );
});

export default MarkdownEditor;
