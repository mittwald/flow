"use client";
import React, { FC } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { extractEditorScope } from "@/components/LiveCodeEditor/lib/extractEditorScope";
import { LiveCodeEditorProps } from "@/components/LiveCodeEditor/types";
import extractDefaultExport from "@/lib/extractDefaultExport";

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

  const scope = extractEditorScope(code);

  const transformCode = (code: string) => {
    try {
      return extractDefaultExport(code);
    } catch (error) {
      return "<p>Example could not be parsed.</p>";
    }
  };

  return (
    <LiveProvider code={code} scope={scope} transformCode={transformCode}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default LiveCodeEditor;
