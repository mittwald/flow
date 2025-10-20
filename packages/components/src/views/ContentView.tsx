/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Content, type ContentProps } from "@/components/Content/Content";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContentView: FC<ContentProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Content"] ?? Content;
  return <View {...props} />;
});
ContentView.displayName = "ContentView";

export default ContentView;
