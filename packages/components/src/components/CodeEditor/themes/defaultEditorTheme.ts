import { githubLightInit } from "@uiw/codemirror-theme-github";
import { tags as t } from "@lezer/highlight";

export const defaultLightTheme = githubLightInit({
  theme: "light",
  settings: {
    fontSize: "var(--code-editor--font-size)",
    fontFamily: "var(--code-editor--font-family)",
    foreground: "var(--form-control--content-color--default)",
    background: "transparent",
    gutterBackground: "var(--form-control--background-color--default)",
    gutterForeground: "var(--form-control--content-color--default)",
    gutterBorder: "var(--code-editor--gutter-separator-color)",
  },
  styles: [
    { tag: t.keyword, color: "var(--code-syntax--color--keyword)" },
    {
      tag: [t.typeName, t.className, t.tagName],
      color: "var(--code-syntax--color--type)",
    },
    { tag: t.variableName, color: "var(--code-syntax--color--variable)" },
    {
      tag: [t.propertyName, t.attributeName],
      color: "var(--code-syntax--color--property)",
    },
    { tag: [t.string, t.regexp], color: "var(--code-syntax--color--string)" },
    { tag: t.number, color: "var(--code-syntax--color--number)" },
    { tag: t.comment, color: "var(--code-syntax--color--comment)" },
    {
      tag: [t.function(t.variableName), t.function(t.propertyName)],
      color: "var(--code-syntax--color--function)",
    },
    {
      tag: [t.operator, t.typeOperator],
      color: "var(--code-syntax--color--operator)",
    },
    { tag: t.invalid, color: "var(--code-syntax--color--invalid)" },
  ],
});
