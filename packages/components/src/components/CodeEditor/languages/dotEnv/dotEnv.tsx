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
import ReactDOM from "react-dom/client";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import { Action } from "@/components/Action";
import { Text } from "@/components/Text";

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
                renderMessage: (view) => {
                  const container = document.createElement("div");
                  const root = ReactDOM.createRoot(container, {
                    identifierPrefix: "codeEditor",
                  });

                  root.render(
                    <Alert status={"danger"}>
                      <Heading>Duplicate key error</Heading>
                      <Content>
                        <Text>
                          Found the key "{identifier}" multiple times. Must be
                          unique.
                        </Text>
                        <Action
                          onAction={() =>
                            view.dispatch({
                              changes: {
                                from,
                                to,
                                empty: true,
                              },
                            })
                          }
                        >
                          <Button>Remove</Button>
                        </Action>
                      </Content>
                    </Alert>,
                  );
                  return container;
                },
                message: `Duplicate key "${identifier}" found.`,
              });
            }
            seenIdentifiers.add(identifier);

            if (identifier !== identifier.toUpperCase()) {
              diagnostics.push({
                from,
                to,
                severity: "warning",
                renderMessage: (view) => {
                  const container = document.createElement("div");
                  const root = ReactDOM.createRoot(container, {
                    identifierPrefix: "codeEditor",
                  });

                  root.render(
                    <Alert status={"warning"}>
                      <Heading>Syntax error</Heading>
                      <Content>
                        <Text>
                          Variable names are usually uppercase (e.g.
                          DATABASE_URL)
                        </Text>
                        <Action
                          onAction={() =>
                            view.dispatch({
                              changes: {
                                from,
                                to,
                                insert: identifier.toUpperCase(),
                              },
                            })
                          }
                        >
                          <Button>Fix</Button>
                        </Action>
                      </Content>
                    </Alert>,
                  );
                  return container;
                },
                message: "",
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
