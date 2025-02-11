/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { FallbackItems, type FallbackItemsProps } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FallbackItemsView: FC<FallbackItemsProps> = (props) => {
  const View =
    useContext(viewComponentContext)["FallbackItems"] ?? FallbackItems;
  return <View {...props} />;
};

export default FallbackItemsView;
