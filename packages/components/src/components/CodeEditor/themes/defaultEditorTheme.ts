import { githubLightInit } from "@uiw/codemirror-theme-github";
import { tags as t } from "@lezer/highlight";

/** The highlight of the active line and of its gutter element. */
const activeLineBackgroundColor =
  "color-mix(in srgb, var(--form-control--background-color--hover) 65%, transparent)";

/*
 * The colors of the editor are derived from design tokens, so that it follows
 * the color scheme. Every setting that is left out falls back to a hard-coded
 * light-mode color of the underlying CodeMirror theme, which is unreadable in
 * dark mode.
 *
 * They cannot be applied through the stylesheet of the component instead:
 * CodeMirror injects its own styles unlayered, and unlayered styles win over
 * the layered ones of Flow regardless of specificity.
 */
export const defaultEditorTheme = githubLightInit({
  theme: "light",
  settings: {
    fontSize: "var(--code-editor--font-size)",
    fontFamily: "var(--code-editor--font-family)",
    foreground: "var(--form-control--content-color--default)",
    background: "transparent",
    caret: "var(--form-control--content-color--default)",
    selection: "var(--form-control--background-color--selected)",
    selectionMatch: "var(--form-control--background-color--selected)",
    gutterBackground: "var(--form-control--background-color--default)",
    gutterForeground: "var(--form-control--content-color--default)",
    gutterBorder: "var(--separator--color)",
    lineHighlight: activeLineBackgroundColor,
  },
  styles: [
    { tag: t.keyword, color: "var(--color--code-syntax--keyword)" },
    {
      tag: [t.typeName, t.className, t.tagName],
      color: "var(--color--code-syntax--type)",
    },
    { tag: t.variableName, color: "var(--color--code-syntax--variable)" },
    {
      tag: [t.propertyName, t.attributeName],
      color: "var(--color--code-syntax--property)",
    },
    { tag: [t.string, t.regexp], color: "var(--color--code-syntax--string)" },
    { tag: t.number, color: "var(--color--code-syntax--number)" },
    { tag: t.comment, color: "var(--color--code-syntax--comment)" },
    {
      tag: [t.function(t.variableName), t.function(t.propertyName)],
      color: "var(--color--code-syntax--function)",
    },
    {
      tag: [t.operator, t.typeOperator],
      color: "var(--color--code-syntax--operator)",
    },
    { tag: t.invalid, color: "var(--color--code-syntax--invalid)" },
  ],
});
