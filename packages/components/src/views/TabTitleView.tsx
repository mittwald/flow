/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TabTitle, type TabTitleProps } from "@/components/Tabs";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TabTitleView: FC<TabTitleProps> = (props) => {
  const View = useContext(viewComponentContext)["TabTitle"] ?? TabTitle;
  return <View {...props} />;
};

export default TabTitleView;
