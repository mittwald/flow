import { type PrismTheme } from "prism-react-renderer";

export const flowTheme: PrismTheme = {
  plain: {
    color: "var(--code-block--content-color)",
    backgroundColor: "var(--code-block--background-color)",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "var(--color--code-syntax--comment)",
        fontStyle: "italic",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "var(--color--code-syntax--keyword)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "var(--color--code-syntax--string)",
      },
    },
    {
      types: ["number", "boolean", "constant", "builtin"],
      style: {
        color: "var(--color--code-syntax--number)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "var(--color--code-syntax--function)",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "var(--color--code-syntax--variable)",
      },
    },
    {
      types: ["property"],
      style: {
        color: "var(--color--code-syntax--property)",
      },
    },
    {
      types: ["class-name", "type"],
      style: {
        color: "var(--color--code-syntax--type)",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "var(--color--code-syntax--operator)",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "var(--color--code-syntax--text)",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "var(--color--code-syntax--keyword)",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "var(--color--code-syntax--property)",
      },
    },
    {
      types: ["attr-value"],
      style: {
        color: "var(--color--code-syntax--string)",
      },
    },
    {
      types: ["inserted"],
      style: {
        color: "var(--color--code-syntax--inserted)",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "var(--color--code-syntax--invalid)",
      },
    },
    {
      types: ["invalid"],
      style: {
        color: "var(--color--code-syntax--invalid)",
        textDecorationLine: "underline",
      },
    },
  ],
};
