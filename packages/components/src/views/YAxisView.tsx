/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { YAxis, type YAxisProps } from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const YAxisView: FC<YAxisProps> = memo((props) => {
  const View = useContext(viewComponentContext)["YAxis"] ?? YAxis;
  return <View {...props} />;
});
YAxisView.displayName = "YAxisView";

export default YAxisView;
