/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ChartGrid,
  type ChartGridProps,
} from "@/components/CartesianChart/components/ChartGrid/ChartGrid";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChartGridView: FC<ChartGridProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ChartGrid"] ?? ChartGrid;
  return <View {...props} />;
});
ChartGridView.displayName = "ChartGridView";

export default ChartGridView;
