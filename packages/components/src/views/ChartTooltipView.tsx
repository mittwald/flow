/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ChartTooltipProps } from "@/components/ChartTooltip";
import React, { useContext } from "react";
import { ChartTooltip } from "@/components/ChartTooltip";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChartTooltipView: FC<ChartTooltipProps> = (props) => {
  const View = useContext(viewComponentContext)["ChartTooltip"] ?? ChartTooltip;
  return <View {...props} />;
};

export default ChartTooltipView;
