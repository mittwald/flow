/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AreaChartProps } from "@/components/AreaChart";
import React, { useContext } from "react";
import { AreaChart } from "@/components/AreaChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AreaChartView: FC<AreaChartProps> = (props) => {
  const View = useContext(viewComponentContext)["AreaChart"] ?? AreaChart;
  return <View {...props} />;
};

export default AreaChartView;
