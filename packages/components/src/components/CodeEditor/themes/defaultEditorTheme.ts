import { githubLightInit } from "@uiw/codemirror-theme-github";
import { tags as t } from "@lezer/highlight";

export const defaultLightTheme = githubLightInit({
  theme: "light",
  settings: {
    fontSize: "var(--code-block--font-size);",
    fontFamily: "FiraCode, monospace",
    foreground: "var(--color--code-syntax--title)",
    background: "transparent",
    gutterBackground: "transparent",
    gutterForeground: "var(--color--code-syntax--title)",
  },
  styles: [
    { tag: t.keyword, color: "var(--color--code-syntax--keyword)" },
    {
      tag: [t.typeName, t.className],
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
