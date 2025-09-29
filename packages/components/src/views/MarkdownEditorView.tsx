/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  MarkdownEditor,
  type MarkdownEditorProps,
} from "@/components/MarkdownEditor/MarkdownEditor";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MarkdownEditorView: FC<MarkdownEditorProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["MarkdownEditor"] ?? MarkdownEditor;
  return <View {...props} />;
});
MarkdownEditorView.displayName = "MarkdownEditorView";

export default MarkdownEditorView;
