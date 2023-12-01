"use client";
import React, { FC } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { extractEditorScope } from "@/components/LiveCodeEditor/lib/extractEditorScope";
import { stripImports } from "@/components/LiveCodeEditor/lib/stripImports";
import { LiveCodeEditorProps } from "@/components/LiveCodeEditor/types";

const LiveCodeEditor: FC<LiveCodeEditorProps> = (props) => {
  const { code } = props;

  if (typeof code !== "string") {
    throw new Error("Expected code prop to be of type 'string'.");
  }

  const scope = extractEditorScope(code);

  return (
    <LiveProvider code={code} scope={scope} transformCode={stripImports}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default LiveCodeEditor;
