/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { GridListItem, type GridListItemProps } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ItemsGridListItemView: FC<GridListItemProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ItemsGridListItem"] ?? GridListItem;
  return <View {...props} />;
};

export default ItemsGridListItemView;
