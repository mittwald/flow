/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { ChartLegend, type ChartLegendProps } from "@/components/ChartLegend";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChartLegendView: FC<ChartLegendProps> = (props) => {
  const View = useContext(viewComponentContext)["ChartLegend"] ?? ChartLegend;
  return <View {...props} />;
};

export default ChartLegendView;
