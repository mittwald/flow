import { type RefObject, useEffect, useRef } from "react";
import { useDrop } from "react-aria";
import { announce } from "@react-aria/live-announcer";
import type { DOMAttributes, FocusableElement } from "@react-types/shared";
import { getAcceptedFiles, matchesAccept } from "@/lib/files/acceptedFiles";
import {
  insertAtCaret,
  type MarkdownEditorUpload,
  removePlaceholder,
  replacePlaceholder,
  uploadedFileMarkdown,
  uploadPlaceholder,
  type ValueEdit,
} from "@/components/MarkdownEditor/lib/fileUpload";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../locales/*.locale.json";

/** @internal */
export type MarkdownEditorFileUploadHandler = (
  file: File,
) => Promise<MarkdownEditorUpload>;

interface Options {
  /** Which file types to take, as an `accept` attribute value. */
  accept?: string;
  /** Uploads one file. Uploading is off entirely while this is undefined. */
  uploadFile?: MarkdownEditorFileUploadHandler;
  /** Turns dropping, pasting and the toolbar button off. */
  isDisabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  textAreaRef: RefObject<HTMLTextAreaElement | null>;
  dropTargetRef: RefObject<HTMLDivElement | null>;
}

interface FileUpload {
  /** Drop handling for the editor's root element. */
  dropProps: DOMAttributes;
  /** Whether a drag is currently over the editor. */
  isDropTarget: boolean;
  /**
   * Uploads the files the toolbar button picked. `undefined` while uploading is
   * off.
   */
  uploadFiles?: (files: File[]) => void;
}

/**
 * Drop, paste and toolbar uploads for the `MarkdownEditor`: a placeholder
 * comment goes to the cursor right away and is replaced by a markdown link once
 * the consumer's upload resolves.
 *
 * @internal
 */
export const useFileUpload = (options: Options): FileUpload => {
  const {
    accept,
    uploadFile,
    isDisabled,
    value,
    onChange,
    textAreaRef,
    dropTargetRef,
  } = options;

  const stringFormatter = useLocalizedStringFormatter(
    locales,
    "MarkdownEditor",
  );

  const isEnabled = !!uploadFile && !isDisabled;

  /*
   * An upload resolves long after the drop, and the editor has kept taking
   * input in the meantime. The textarea's own value is the only one that is
   * current by then — the `value` prop is a render old whenever two uploads
   * resolve in the same tick.
   */
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const readValue = () => textAreaRef.current?.value ?? valueRef.current;

  /*
   * A textarea keeps its `selectionStart` after losing focus, so the caret is
   * still readable once the attachment button has taken the focus away. What it
   * cannot tell apart is a caret at position 0 from one that was never placed —
   * both read 0, and appending is the better answer for the second.
   */
  const wasFocusedRef = useRef(false);
  useEffect(() => {
    const textArea = textAreaRef.current;

    if (!textArea) {
      return;
    }

    const rememberFocus = () => {
      wasFocusedRef.current = true;
    };

    textArea.addEventListener("focus", rememberFocus);
    return () => textArea.removeEventListener("focus", rememberFocus);
  }, [textAreaRef]);

  const readSelection = () => {
    const textArea = textAreaRef.current;
    const fallback = readValue().length;
    return {
      start: textArea?.selectionStart ?? fallback,
      end: textArea?.selectionEnd ?? fallback,
    };
  };

  const applyEdit = (edit: ValueEdit) => {
    valueRef.current = edit.value;

    const textArea = textAreaRef.current;
    if (textArea) {
      /*
       * Written before the re-render so an upload resolving in the same tick
       * reads this one's result, and the selection restored after it, once
       * React has rendered the controlled value.
       */
      textArea.value = edit.value;
      requestAnimationFrame(() => {
        textArea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
      });
    }

    onChange(edit.value);
  };

  const runUpload = async (
    upload: MarkdownEditorFileUploadHandler,
    file: File,
    placeholder: string,
  ) => {
    announce(
      stringFormatter.format("upload.pending", { name: file.name }),
      "polite",
    );

    try {
      const result = await upload(file);
      const selection = readSelection();
      const edit = replacePlaceholder(
        readValue(),
        placeholder,
        uploadedFileMarkdown(file, result),
        selection.start,
        selection.end,
      );

      if (edit) {
        applyEdit(edit);
      }

      announce(
        stringFormatter.format("upload.succeeded", { name: file.name }),
        "polite",
      );
    } catch {
      const selection = readSelection();
      const edit = removePlaceholder(
        readValue(),
        placeholder,
        selection.start,
        selection.end,
      );

      if (edit) {
        applyEdit(edit);
      }

      announce(
        stringFormatter.format("upload.failed", { name: file.name }),
        "assertive",
      );
    }
  };

  const uploadFiles = (files: File[]) => {
    if (!uploadFile || files.length === 0) {
      return;
    }

    const textArea = textAreaRef.current;
    const caret =
      textArea && wasFocusedRef.current
        ? textArea.selectionStart
        : readValue().length;

    const uploads = files.map((file) => ({
      file,
      placeholder: uploadPlaceholder(file.name),
    }));

    applyEdit(
      insertAtCaret(
        readValue(),
        uploads.map((upload) => upload.placeholder).join("\n"),
        caret,
      ),
    );
    textArea?.focus();

    for (const upload of uploads) {
      void runUpload(uploadFile, upload.file, upload.placeholder);
    }
  };

  const uploadFilesRef = useRef(uploadFiles);
  uploadFilesRef.current = uploadFiles;

  /*
   * The paste listener is attached imperatively rather than through react-aria's
   * `useClipboard`, which calls `preventDefault` on every paste it sees and
   * would take plain text pasting with it.
   */
  useEffect(() => {
    const textArea = textAreaRef.current;

    if (!textArea || !isEnabled) {
      return;
    }

    const handlePaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? []).filter(
        (file) => matchesAccept(file, accept),
      );

      if (files.length === 0) {
        return;
      }

      event.preventDefault();
      uploadFilesRef.current(files);
    };

    textArea.addEventListener("paste", handlePaste);
    return () => textArea.removeEventListener("paste", handlePaste);
  }, [isEnabled, accept, textAreaRef]);

  const { dropProps, isDropTarget } = useDrop({
    ref: dropTargetRef as RefObject<FocusableElement | null>,
    isDisabled: !isEnabled,
    onDrop: (event) => {
      void (async () => {
        uploadFilesRef.current(await getAcceptedFiles(event.items, accept));
      })();
    },
  });

  return {
    dropProps,
    isDropTarget,
    uploadFiles: uploadFile ? uploadFiles : undefined,
  };
};
