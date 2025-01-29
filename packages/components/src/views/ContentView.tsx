/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Content, type ContentProps } from "@/components/Content";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContentView: FC<ContentProps> = (props) => {
  const View = useContext(viewComponentContext)["Content"] ?? Content;
  return <View {...props} />;
};

export default ContentView;
