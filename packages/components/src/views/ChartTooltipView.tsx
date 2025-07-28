/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ChartTooltip,
  type ChartTooltipProps,
} from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChartTooltipView: FC<ChartTooltipProps> = (props) => {
  const View = useContext(viewComponentContext)["ChartTooltip"] ?? ChartTooltip;
  return <View {...props} />;
};

export default ChartTooltipView;
