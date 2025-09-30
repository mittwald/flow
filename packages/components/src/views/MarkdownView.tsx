/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Markdown, type MarkdownProps } from "@/components/Markdown";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MarkdownView: FC<MarkdownProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Markdown"] ?? Markdown;
  return <View {...props} />;
});
MarkdownView.displayName = "MarkdownView";

export default MarkdownView;
