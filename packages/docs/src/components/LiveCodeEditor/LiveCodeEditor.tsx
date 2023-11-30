"use client";
import React, { FC } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { LiveCodeEditorProps } from "./types";
import { extractEditorScope } from "./lib/extractEditorScope";
import { stripImports } from "./lib/stripImports";

const LiveCodeEditor: FC<LiveCodeEditorProps> = (props) => {
  const { code } = props;

  const scope = extractEditorScope(code);

  return (
    <LiveProvider code={props.code} scope={scope} transformCode={stripImports}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default LiveCodeEditor;
