/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ChartTooltip,
  type ChartTooltipProps,
} from "@/components/CartesianChart/components/ChartTooltip/ChartTooltip";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChartTooltipView: FC<ChartTooltipProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ChartTooltip"] ?? ChartTooltip;
  return <View {...props} />;
});
ChartTooltipView.displayName = "ChartTooltipView";

export default ChartTooltipView;
