/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Heading, type HeadingProps } from "@/components/Heading";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const HeadingView: FC<HeadingProps> = (props) => {
  const View = useContext(viewComponentContext)["Heading"] ?? Heading;
  return <View {...props} />;
};

export default HeadingView;
