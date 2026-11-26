import { type PrismTheme } from "prism-react-renderer";

/**
 * Colors the live editor's code like Flow's `CodeBlock`, whose CodeMirror theme
 * maps the same syntax tokens. Prism nests its tokens and merges the styles of
 * all of them, outermost first — so `script`, the JavaScript inside a JSX tag,
 * resets to the plain color instead of inheriting the tag's.
 *
 * Prism leaves identifiers untokenized, so they take the plain color, which is
 * the variable color CodeMirror gives them. Only the text between JSX tags
 * keeps the content color.
 */
export const flowTheme: PrismTheme = {
  plain: {
    color: "var(--code-syntax--color--variable)",
    backgroundColor: "var(--code-block--background-color)",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "var(--code-syntax--color--comment)",
        fontStyle: "italic",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "var(--code-syntax--color--keyword)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "var(--code-syntax--color--string)",
      },
    },
    {
      types: ["number", "boolean", "constant", "builtin"],
      style: {
        color: "var(--code-syntax--color--number)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "var(--code-syntax--color--function)",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "var(--code-syntax--color--variable)",
      },
    },
    {
      types: ["property"],
      style: {
        color: "var(--code-syntax--color--property)",
      },
    },
    {
      types: ["class-name", "type"],
      style: {
        color: "var(--code-syntax--color--type)",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "var(--code-syntax--color--operator)",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "var(--code-syntax--color--comment)",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "var(--code-syntax--color--type)",
      },
    },
    {
      types: ["script", "maybe-class-name"],
      style: {
        color: "var(--code-syntax--color--variable)",
      },
    },
    {
      types: ["plain-text"],
      style: {
        color: "var(--code-block--content-color)",
      },
    },
    {
      types: ["property-access"],
      style: {
        color: "var(--code-syntax--color--property)",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "var(--code-syntax--color--property)",
      },
    },
    {
      types: ["attr-value"],
      style: {
        color: "var(--code-syntax--color--string)",
      },
    },
    {
      types: ["attr-equals"],
      style: {
        color: "var(--code-syntax--color--operator)",
      },
    },
    {
      types: ["invalid"],
      style: {
        color: "var(--code-syntax--color--invalid)",
        textDecorationLine: "underline",
      },
    },
  ],
};
