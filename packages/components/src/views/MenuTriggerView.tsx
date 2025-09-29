/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  MenuTrigger,
  type MenuTriggerProps,
} from "@/components/OverlayTrigger/components/MenuTrigger/MenuTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MenuTriggerView: FC<MenuTriggerProps> = memo((props) => {
  const View = useContext(viewComponentContext)["MenuTrigger"] ?? MenuTrigger;
  return <View {...props} />;
});
MenuTriggerView.displayName = "MenuTriggerView";

export default MenuTriggerView;
