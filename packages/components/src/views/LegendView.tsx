/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Legend, type LegendProps } from "@/components/Legend";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LegendView: FC<LegendProps> = (props) => {
  const View = useContext(viewComponentContext)["Legend"] ?? Legend;
  return <View {...props} />;
};

export default LegendView;
