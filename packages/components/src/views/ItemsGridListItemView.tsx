/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { GridListItemProps } from "@/components/List";
import React, { useContext } from "react";
import { GridListItem } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ItemsGridListItemView: FC<GridListItemProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ItemsGridListItem"] ?? GridListItem;
  return <View {...props} />;
};

export default ItemsGridListItemView;
