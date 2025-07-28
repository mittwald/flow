/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { XAxis, type XAxisProps } from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const XAxisView: FC<XAxisProps> = (props) => {
  const View = useContext(viewComponentContext)["XAxis"] ?? XAxis;
  return <View {...props} />;
};

export default XAxisView;
