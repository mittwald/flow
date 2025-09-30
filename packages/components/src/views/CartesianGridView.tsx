/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  CartesianGrid,
  type CartesianGridProps,
} from "@/components/CartesianChart/components/CartesianGrid/CartesianGrid";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CartesianGridView: FC<CartesianGridProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["CartesianGrid"] ?? CartesianGrid;
  return <View {...props} />;
});
CartesianGridView.displayName = "CartesianGridView";

export default CartesianGridView;
