import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tabs.module.scss";
import { deepFilterByType, deepFindOfType } from "@/lib/react/deepFindOfType";
import { TabList } from "@/components/Tabs/components/TabList";
import { TabTitle } from "@/components/Tabs/components/TabTitle";
import { Tab } from "@/components/Tabs/components/Tab";

export interface TabsProps
  extends Omit<Aria.TabsProps, "children">,
    PropsWithChildren {}

export const Tabs: FC<TabsProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tabs, className);

  const tabChildren = deepFilterByType(children, Tab);

  const titles = tabChildren.map((tab, index) => {
    const tabId = tab.props.id ?? String(index);
    const titleChild = deepFindOfType(tab.props.children, TabTitle);
    return (
      <TabTitle id={tabId} key={tabId} shouldRender>
        {titleChild?.props.children ?? "Tab"}
      </TabTitle>
    );
  });

  const panels = tabChildren.map((el, index) => {
    const tabId = el.props.id ?? String(index);
    return <Tab key={tabId} id={tabId} {...el.props} shouldRender />;
  });

  return (
    <Aria.Tabs className={rootClassName} {...rest}>
      <TabList>{titles}</TabList>
      {panels}
    </Aria.Tabs>
  );
};

export default Tabs;
