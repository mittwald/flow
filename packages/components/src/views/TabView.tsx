/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Tab, type TabProps } from "@/components/Tabs";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TabView: FC<TabProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Tab"] ?? Tab;
  return <View {...props} />;
});
TabView.displayName = "TabView";

export default TabView;
