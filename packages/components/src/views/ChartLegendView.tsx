/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ChartLegend,
  type ChartLegendProps,
} from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChartLegendView: FC<ChartLegendProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ChartLegend"] ?? ChartLegend;
  return <View {...props} />;
});
ChartLegendView.displayName = "ChartLegendView";

export default ChartLegendView;
