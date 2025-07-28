/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  CartesianChart,
  type CartesianChartProps,
} from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CartesianChartView: FC<CartesianChartProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CartesianChart"] ?? CartesianChart;
  return <View {...props} />;
};

export default CartesianChartView;
