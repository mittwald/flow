/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { TabTitle, type TabTitleProps } from "@/components/Tabs";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TabTitleView: FC<TabTitleProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TabTitle"] ?? TabTitle;
  return <View {...props} />;
});
TabTitleView.displayName = "TabTitleView";

export default TabTitleView;
