/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { MarkdownProps } from "@/components/Markdown";
import React, { useContext } from "react";
import { Markdown } from "@/components/Markdown";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MarkdownView: FC<MarkdownProps> = (props) => {
  const View = useContext(viewComponentContext)["Markdown"] ?? Markdown;
  return <View {...props} />;
};

export default MarkdownView;
