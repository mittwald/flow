/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { ContextMenu, type ContextMenuProps } from "@/components/ContextMenu";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuView: FC<ContextMenuProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ContextMenu"] ?? ContextMenu;
  return <View {...props} />;
});
ContextMenuView.displayName = "ContextMenuView";

export default ContextMenuView;
