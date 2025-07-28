/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  CartesianGrid,
  type CartesianGridProps,
} from "@/components/CartesianChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CartesianGridView: FC<CartesianGridProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CartesianGrid"] ?? CartesianGrid;
  return <View {...props} />;
};

export default CartesianGridView;
