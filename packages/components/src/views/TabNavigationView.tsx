/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TabNavigation,
  type TabNavigationProps,
} from "@/components/TabNavigation/TabNavigation";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TabNavigationView: FC<TabNavigationProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["TabNavigation"] ?? TabNavigation;
  return <View {...props} />;
});
TabNavigationView.displayName = "TabNavigationView";

export default TabNavigationView;
