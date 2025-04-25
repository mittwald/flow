/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { MenuItemProps } from "@/components/MenuItem";
import React, { useContext } from "react";
import { MenuItem } from "@/components/MenuItem";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MenuItemView: FC<MenuItemProps> = (props) => {
  const View = useContext(viewComponentContext)["MenuItem"] ?? MenuItem;
  return <View {...props} />;
};

export default MenuItemView;
