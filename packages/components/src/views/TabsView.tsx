/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Tabs, type TabsProps } from "@/components/Tabs";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TabsView: FC<TabsProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Tabs"] ?? Tabs;
  return <View {...props} />;
});
TabsView.displayName = "TabsView";

export default TabsView;
