/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  CartesianChart,
  type CartesianChartProps,
} from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CartesianChartView: FC<CartesianChartProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["CartesianChart"] ?? CartesianChart;
  return <View {...props} />;
});
CartesianChartView.displayName = "CartesianChartView";

export default CartesianChartView;
