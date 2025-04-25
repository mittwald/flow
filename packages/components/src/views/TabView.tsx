/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TabProps } from "@/components/Tabs";
import React, { useContext } from "react";
import { Tab } from "@/components/Tabs";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TabView: FC<TabProps> = (props) => {
  const View = useContext(viewComponentContext)["Tab"] ?? Tab;
  return <View {...props} />;
};

export default TabView;
