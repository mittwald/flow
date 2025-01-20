/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { MenuItem, type MenuItemProps } from "~/components/MenuItem";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const MenuItemView: FC<MenuItemProps> = (props) => {
  const View = useContext(viewComponentContext)["MenuItem"] ?? MenuItem;
  return <View {...props} />;
};

export default MenuItemView;
