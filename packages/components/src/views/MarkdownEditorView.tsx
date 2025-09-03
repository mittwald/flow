/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  MarkdownEditor,
  type MarkdownEditorProps,
} from "@/components/MarkdownEditor";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MarkdownEditorView: FC<MarkdownEditorProps> = (props) => {
  const View =
    useContext(viewComponentContext)["MarkdownEditor"] ?? MarkdownEditor;
  return <View {...props} />;
};

export default MarkdownEditorView;
