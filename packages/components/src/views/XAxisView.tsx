/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { XAxis, type XAxisProps } from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const XAxisView: FC<XAxisProps> = memo((props) => {
  const View = useContext(viewComponentContext)["XAxis"] ?? XAxis;
  return <View {...props} />;
});
XAxisView.displayName = "XAxisView";

export default XAxisView;
