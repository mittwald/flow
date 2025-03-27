/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { AreaChart, type AreaChartProps } from "@/components/AreaChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AreaChartView: FC<AreaChartProps> = (props) => {
  const View = useContext(viewComponentContext)["AreaChart"] ?? AreaChart;
  return <View {...props} />;
};

export default AreaChartView;
