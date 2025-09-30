/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Line, type LineProps } from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LineView: FC<LineProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Line"] ?? Line;
  return <View {...props} />;
});
LineView.displayName = "LineView";

export default LineView;
