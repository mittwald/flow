/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  GridList,
  type GridListProps,
} from "@/components/List/components/Items/views/GridList/GridList";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ItemsGridListView: FC<GridListProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ItemsGridList"] ?? GridList;
  return <View {...props} />;
});
ItemsGridListView.displayName = "ItemsGridListView";

export default ItemsGridListView;
