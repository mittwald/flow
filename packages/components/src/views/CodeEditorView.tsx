/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  CodeEditor,
  type CodeEditorProps,
} from "@/components/CodeEditor/CodeEditor";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CodeEditorView: FC<CodeEditorProps> = memo((props) => {
  const View = useContext(viewComponentContext)["CodeEditor"] ?? CodeEditor;
  return <View {...props} />;
});
CodeEditorView.displayName = "CodeEditorView";

export default CodeEditorView;
