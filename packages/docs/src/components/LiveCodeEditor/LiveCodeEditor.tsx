"use client";
import React, { FC, useState } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { extractEditorScope } from "@/components/LiveCodeEditor/lib/extractEditorScope";
import { LiveCodeEditorProps } from "@/components/LiveCodeEditor/types";
import extractDefaultExport from "@/lib/extractDefaultExport";
import styles from "./LiveCodeEditor.module.css";
import { themes } from "prism-react-renderer";
import { PreviewWrapper } from "@/components/LiveCodeEditor/components/PreviewWrapper";
import { Button } from "@mittwald/flow-components/Button";

// Waiting for https://github.com/FormidableLabs/react-live/issues/339
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const LiveCodeEditor: FC<LiveCodeEditorProps> = (props) => {
  const { code } = props;

  if (typeof code !== "string") {
    throw new Error("Expected code prop to be of type 'string'.");
  }

  const [codeExpanded, setCodeExpanded] = useState(false);

  const scope = extractEditorScope(code);

  const transformRenderedCode = (code: string) => {
    if (!codeExpanded) {
      return `<>${code}</>`;
    }
    return `<>${transformCode(code)}</>`;
  };

  const transformCode = (code: string) => {
    try {
      return extractDefaultExport(code).trim();
    } catch (error) {
      return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
    }
  };

  const handleCodeExpandedClick = () => {
    setCodeExpanded((expanded) => !expanded);
  };

  return (
    <div className={styles.root}>
      <LiveProvider
        code={codeExpanded ? code.trim() : transformCode(code)}
        scope={scope}
        transformCode={transformRenderedCode}
      >
        <LiveError className={styles.error} />
        <LivePreview Component={PreviewWrapper} />
        <Button
          variant={codeExpanded ? "primary" : "secondary"}
          onPress={handleCodeExpandedClick}
          className={styles.expandCodeButton}
        >
          {codeExpanded ? "Simplify Code" : "Expand Code"}
        </Button>
        <LiveEditor className={styles.editor} theme={themes.vsDark} />
      </LiveProvider>
    </div>
  );
};

export default LiveCodeEditor;
