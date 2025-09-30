/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Area, type AreaProps } from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AreaView: FC<AreaProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Area"] ?? Area;
  return <View {...props} />;
});
AreaView.displayName = "AreaView";

export default AreaView;
