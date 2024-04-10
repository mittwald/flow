import type { FC } from "react";
import React from "react";
import { ChildPropsStore } from "@/lib/childProps/ChildPropsStore";
import type { TabProps } from "@/components/Tabs";
import { Tab } from "@/components/Tabs";

export const TabPanels: FC = () =>
  ChildPropsStore.useFromContext("Tab")
    .usePropsArray<TabProps>()
    .map((props, index) => {
      const tabId = props.id ?? String(index);
      return <Tab key={tabId} id={tabId} {...props} shouldRender />;
    });
