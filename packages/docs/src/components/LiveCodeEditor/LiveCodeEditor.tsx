"use client";
import React, { ChangeEventHandler, FC, useState } from "react";
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
      return extractDefaultExport(code);
    } catch (error) {
      return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
    }
  };

  const handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setCodeExpanded(event.currentTarget.checked);
  };

  return (
    <LiveProvider
      code={codeExpanded ? code : transformCode(code)}
      scope={scope}
      transformCode={transformRenderedCode}
    >
      <LiveError />
      <LivePreview />
      <div>
        <input type="checkbox" onChange={handleCheckboxChange} />
        <label>Expand Code</label>
      </div>
      <LiveEditor />
    </LiveProvider>
  );
};

export default LiveCodeEditor;
