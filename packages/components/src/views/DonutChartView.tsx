/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { DonutChart, type DonutChartProps } from "@/components/DonutChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DonutChartView: FC<DonutChartProps> = (props) => {
  const View = useContext(viewComponentContext)["DonutChart"] ?? DonutChart;
  return <View {...props} />;
};

export default DonutChartView;
