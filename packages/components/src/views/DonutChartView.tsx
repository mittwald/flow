/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  DonutChart,
  type DonutChartProps,
} from "@/components/DonutChart/DonutChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DonutChartView: FC<DonutChartProps> = memo((props) => {
  const View = useContext(viewComponentContext)["DonutChart"] ?? DonutChart;
  return <View {...props} />;
});
DonutChartView.displayName = "DonutChartView";

export default DonutChartView;
