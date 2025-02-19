/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { GridList, type GridListProps } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ItemsGridListView: FC<GridListProps> = (props) => {
  const View = useContext(viewComponentContext)["ItemsGridList"] ?? GridList;
  return <View {...props} />;
};

export default ItemsGridListView;
