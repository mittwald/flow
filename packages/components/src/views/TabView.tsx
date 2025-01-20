/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Tab, type TabProps } from "~/components/Tabs";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const TabView: FC<TabProps> = (props) => {
  const View = useContext(viewComponentContext)["Tab"] ?? Tab;
  return <View {...props} />;
};

export default TabView;
