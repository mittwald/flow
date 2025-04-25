/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { CodeBlockProps } from "@/components/CodeBlock";
import React, { useContext } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CodeBlockView: FC<CodeBlockProps> = (props) => {
  const View = useContext(viewComponentContext)["CodeBlock"] ?? CodeBlock;
  return <View {...props} />;
};

export default CodeBlockView;
