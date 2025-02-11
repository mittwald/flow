/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  MenuTrigger,
  type MenuTriggerProps,
} from "@/components/OverlayTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MenuTriggerView: FC<MenuTriggerProps> = (props) => {
  const View = useContext(viewComponentContext)["MenuTrigger"] ?? MenuTrigger;
  return <View {...props} />;
};

export default MenuTriggerView;
