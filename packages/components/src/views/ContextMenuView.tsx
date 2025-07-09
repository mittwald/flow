/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { ContextMenu, type ContextMenuProps } from "@/components/ContextMenu";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuView: FC<ContextMenuProps> = (props) => {
  const View = useContext(viewComponentContext)["ContextMenu"] ?? ContextMenu;
  return <View {...props} />;
};

export default ContextMenuView;
