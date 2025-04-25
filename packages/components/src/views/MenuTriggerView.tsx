/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { MenuTriggerProps } from "@/components/OverlayTrigger";
import React, { useContext } from "react";
import { MenuTrigger } from "@/components/OverlayTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MenuTriggerView: FC<MenuTriggerProps> = (props) => {
  const View = useContext(viewComponentContext)["MenuTrigger"] ?? MenuTrigger;
  return <View {...props} />;
};

export default MenuTriggerView;
