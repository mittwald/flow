/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Area, type AreaProps } from "@/components/AreaChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AreaView: FC<AreaProps> = (props) => {
  const View = useContext(viewComponentContext)["Area"] ?? Area;
  return <View {...props} />;
};

export default AreaView;
