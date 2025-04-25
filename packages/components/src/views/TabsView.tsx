/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TabsProps } from "@/components/Tabs";
import React, { useContext } from "react";
import { Tabs } from "@/components/Tabs";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TabsView: FC<TabsProps> = (props) => {
  const View = useContext(viewComponentContext)["Tabs"] ?? Tabs;
  return <View {...props} />;
};

export default TabsView;
