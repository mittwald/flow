import {
  HighlightStyle,
  LanguageSupport,
  LRLanguage,
  syntaxHighlighting,
  syntaxTree,
} from "@codemirror/language";
import type { Diagnostic } from "@codemirror/lint";
import { linter } from "@codemirror/lint";
import { styleTags, tags as t } from "@lezer/highlight";
import parser from "./dotEnv.grammar";
import type { LanguageContainer } from "@/components/CodeEditor/languages";

const definedStyle = HighlightStyle.define([
  { tag: t.variableName, fontWeight: "bold" },
  { tag: t.lineComment, fontStyle: "italic" },
]);

const envHighlighting = styleTags({
  Identifier: t.variableName,
  Equal: t.operator,
  SQString: t.string,
  DQString: t.string,
  BareValueToken: t.string,
  Comment: t.lineComment,
  Hash: t.lineComment,
});

const lrLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [envHighlighting],
  }),
  languageData: {
    commentTokens: { line: "#" },
  },
});

export const validator = (input: string) => {
  let isValid = true;
  lrLanguage.parser.parse(input).iterate({
    enter: (node) => {
      if (node.type.isError) {
        isValid = false;
      }
    },
  });

  return isValid;
};

const language: LanguageContainer = [
  () => syntaxHighlighting(definedStyle),
  () => new LanguageSupport(lrLanguage),
  () =>
    linter((view) => {
      const diagnostics: Diagnostic[] = [];
      const doc = view.state.doc;
      const seenIdentifiers = new Set<string>();

      const errorNodes: { from: number; to: number }[] = [];

      syntaxTree(view.state).iterate({
        enter: (node) => {
          const from = node.from;
          const to = node.to;

          if (node.type.isError) {
            errorNodes.push({ from, to });
          }

          if (node.name === "Identifier") {
            const identifier = doc.sliceString(from, to);

            if (seenIdentifiers.has(identifier)) {
              diagnostics.push({
                from,
                to: from + identifier.length,
                severity: "error",
                message: `Duplicate key "${identifier}" found.`,
              });
            }
            seenIdentifiers.add(identifier);

            if (identifier !== identifier.toUpperCase()) {
              diagnostics.push({
                from,
                to,
                severity: "warning",
                message:
                  "Variable names are usually uppercase (e.g. DATABASE_URL)",
              });
            }
          }
        },
      });

      if (errorNodes.length) {
        const lastError = errorNodes[errorNodes.length - 1];
        const docText = doc.toString();
        const docEnd = doc.length;

        const isLastErrorAtEOF =
          lastError?.from === docEnd && lastError?.to === docEnd;

        const hasNoFinalNewline = !docText.endsWith("\n");

        if (isLastErrorAtEOF && hasNoFinalNewline) {
          diagnostics.push({
            from: docEnd,
            to: docEnd,
            severity: "error",
            message: "Must end with a newline.",
          });
        } else {
          errorNodes.forEach((node) =>
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: "error",
              message:
                "Syntax error: Unexpected character or malformed assignment",
            }),
          );
        }
      }

      return diagnostics;
    }),
];

export default language;
