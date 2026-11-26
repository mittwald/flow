/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ItemAction,
  type ItemActionProps,
} from "@/components/ItemAction/ItemAction";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ItemActionView: FC<ItemActionProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ItemAction"] ?? ItemAction;
  return <View {...props} />;
});
ItemActionView.displayName = "ItemActionView";

export default ItemActionView;
