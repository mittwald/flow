/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ChartLegendProps } from "@/components/ChartLegend";
import React, { useContext } from "react";
import { ChartLegend } from "@/components/ChartLegend";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChartLegendView: FC<ChartLegendProps> = (props) => {
  const View = useContext(viewComponentContext)["ChartLegend"] ?? ChartLegend;
  return <View {...props} />;
};

export default ChartLegendView;
