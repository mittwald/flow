/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ListBoxItem,
  type ListBoxItemProps,
} from "@/components/List/components/Items/views/ListBoxItem/ListBoxItem";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ItemsListBoxItemView: FC<ListBoxItemProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["ItemsListBoxItem"] ?? ListBoxItem;
  return <View {...props} />;
});
ItemsListBoxItemView.displayName = "ItemsListBoxItemView";

export default ItemsListBoxItemView;
