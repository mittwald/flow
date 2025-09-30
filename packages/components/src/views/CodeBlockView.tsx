/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { CodeBlock, type CodeBlockProps } from "@/components/CodeBlock";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CodeBlockView: FC<CodeBlockProps> = memo((props) => {
  const View = useContext(viewComponentContext)["CodeBlock"] ?? CodeBlock;
  return <View {...props} />;
});
CodeBlockView.displayName = "CodeBlockView";

export default CodeBlockView;
