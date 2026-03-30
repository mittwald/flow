/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ListBox,
  type ListBoxProps,
} from "@/components/List/components/Items/views/ListBox/ListBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ItemsListBoxView: FC<ListBoxProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ItemsListBox"] ?? ListBox;
  return <View {...props} />;
});
ItemsListBoxView.displayName = "ItemsListBoxView";

export default ItemsListBoxView;
