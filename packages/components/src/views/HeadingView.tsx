/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Heading, type HeadingProps } from "@/components/Heading";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const HeadingView: FC<HeadingProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Heading"] ?? Heading;
  return <View {...props} />;
});
HeadingView.displayName = "HeadingView";

export default HeadingView;
