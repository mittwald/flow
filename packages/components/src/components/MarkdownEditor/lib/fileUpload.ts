/**
 * The result of uploading a file dropped into, pasted into or selected in a
 * `MarkdownEditor`.
 */
export interface MarkdownEditorUpload {
  /** The URL the uploaded file is available at. */
  url: string;
  /**
   * The link text of the inserted markdown — the alt text for an image.
   * Defaults to the name of the uploaded file.
   */
  name?: string;
}

/** A new editor value together with where the cursor ends up in it. */
export interface ValueEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/*
 * `-->` inside the file name would end the comment early and leave the rest of
 * it as visible text. Nothing else in a file name can escape an HTML comment.
 */
const escapeComment = (fileName: string) => fileName.replaceAll("-->", "--");

/*
 * Brackets are what ends a markdown link label, and a line break ends the link
 * altogether. A file name may legally contain both.
 *
 * The backslash is escaped in the same pass, and has to be: escaping only the
 * brackets turns `a\]b` into `a\\]b`, which markdown reads as an escaped
 * backslash followed by a bare `]` — the label ends right there.
 */
const escapeLinkLabel = (label: string) =>
  label
    .replace(/[\\[\]]/g, "\\$&")
    .replace(/\s+/g, " ")
    .trim();

/*
 * A bare link target ends at the first whitespace or unbalanced parenthesis.
 * Pointy brackets take a target that contains either — and are themselves the
 * only thing that cannot appear inside them.
 */
const escapeLinkTarget = (url: string) =>
  /[\s()]/.test(url) ? `<${url.replace(/[<>]/g, encodeURIComponent)}>` : url;

/**
 * What sits at the cursor while a file uploads. An HTML comment, so it stays
 * out of the rendered preview and out of a message sent before the upload
 * finished — the same marker GitHub leaves behind.
 *
 * @internal
 */
export const uploadPlaceholder = (fileName: string): string =>
  `<!-- Uploading "${escapeComment(fileName)}"... -->`;

/**
 * The markdown a finished upload leaves behind: an embed for an image, a link
 * for everything else.
 *
 * @internal
 */
export const uploadedFileMarkdown = (
  file: Pick<File, "name" | "type">,
  upload: MarkdownEditorUpload,
): string => {
  const label = escapeLinkLabel(upload.name ?? file.name);
  const target = escapeLinkTarget(upload.url);
  const link = `[${label}](${target})`;

  return file.type.startsWith("image/") ? `!${link}` : link;
};

/**
 * Splices `insert` into `value` at `caret`, on a line of its own, and reports
 * where the cursor ends up.
 *
 * @internal
 */
export const insertAtCaret = (
  value: string,
  insert: string,
  caret: number,
): ValueEdit => {
  const before = value.slice(0, caret);
  const after = value.slice(caret);

  const prefix = before.length > 0 && !before.endsWith("\n") ? "\n" : "";
  const suffix = after.startsWith("\n") ? "" : "\n";
  const inserted = `${prefix}${insert}${suffix}`;

  return {
    value: `${before}${inserted}${after}`,
    selectionStart: caret + inserted.length,
    selectionEnd: caret + inserted.length,
  };
};

/**
 * Replaces the first occurrence of `search`, carrying the cursor along. Returns
 * `null` when the editor no longer contains it — the user deleted the
 * placeholder while the upload was running, and the result is dropped.
 *
 * @internal
 */
export const replacePlaceholder = (
  value: string,
  search: string,
  replacement: string,
  selectionStart: number,
  selectionEnd: number,
): ValueEdit | null => {
  const index = value.indexOf(search);

  if (index === -1) {
    return null;
  }

  const end = index + search.length;
  const delta = replacement.length - search.length;

  /*
   * A cursor before the placeholder does not move, one after it moves by the
   * length difference, and one inside it — the user was typing where the file
   * landed — comes to rest behind the replacement.
   */
  const shift = (position: number) => {
    if (position <= index) {
      return position;
    }
    return position >= end ? position + delta : index + replacement.length;
  };

  return {
    value: value.slice(0, index) + replacement + value.slice(end),
    selectionStart: shift(selectionStart),
    selectionEnd: shift(selectionEnd),
  };
};

/**
 * Takes a placeholder back out after a failed upload, including the line break
 * it was inserted with.
 *
 * @internal
 */
export const removePlaceholder = (
  value: string,
  placeholder: string,
  selectionStart: number,
  selectionEnd: number,
): ValueEdit | null =>
  replacePlaceholder(
    value,
    `${placeholder}\n`,
    "",
    selectionStart,
    selectionEnd,
  ) ?? replacePlaceholder(value, placeholder, "", selectionStart, selectionEnd);
