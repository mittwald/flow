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
  { tag: t.variableName, color: "#0086b3", fontWeight: "bold" },
  { tag: t.operator, color: "#333" },
  { tag: t.string, color: "#50a14f" },
  { tag: t.lineComment, color: "#999", fontStyle: "italic" },
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

export const language = LRLanguage.define({
  parser: parser.configure({
    props: [envHighlighting],
  }),
  languageData: {
    commentTokens: { line: "#" },
  },
});

const dotEnvLanguage: LanguageContainer = [
  () => syntaxHighlighting(definedStyle),
  () => new LanguageSupport(language),
  () =>
    linter((view) => {
      const diagnostics: Diagnostic[] = [];
      const doc = view.state.doc;
      const seenIdentifiers = new Set<string>();

      const errorNodes: { from: number; to: number }[] = [];

      syntaxTree(view.state).iterate({
        enter: (node) => {
          if (node.type.isError) {
            errorNodes.push({ from: node.from, to: node.to });
          }

          if (node.name === "Identifier") {
            const identifier = view.state.doc.sliceString(node.from, node.to);

            if (seenIdentifiers.has(identifier)) {
              diagnostics.push({
                from: node.from,
                to: node.from + identifier.length,
                severity: "error",
                message: `Duplicate key "${identifier}" found.`,
              });
            }
            seenIdentifiers.add(identifier);

            if (identifier !== identifier.toUpperCase()) {
              diagnostics.push({
                from: node.from,
                to: node.to,
                severity: "warning",
                message:
                  "Variable names are usually uppercase (e.g., DATABASE_URL)",
                actions: [
                  {
                    name: "Fix",
                    apply(view, from, to) {
                      view.dispatch({
                        changes: { from, to, insert: identifier.toUpperCase() },
                      });
                    },
                  },
                ],
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
            severity: "info",
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

export default dotEnvLanguage;
