/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { CartesianGridProps } from "@/components/CartesianGrid";
import React, { useContext } from "react";
import { CartesianGrid } from "@/components/CartesianGrid";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CartesianGridView: FC<CartesianGridProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CartesianGrid"] ?? CartesianGrid;
  return <View {...props} />;
};

export default CartesianGridView;
