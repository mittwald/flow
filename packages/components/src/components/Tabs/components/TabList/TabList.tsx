import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabList.module.scss";
import type { TabProps, TabTitleProps } from "@/components/Tabs";
import { TabTitle } from "@/components/Tabs";
import { ChildPropsStore } from "@/lib/childProps/ChildPropsStore";

export interface TabListProps
  extends Omit<Aria.TabListProps<TabTitleProps>, "children"> {}

export const TabList: FC<TabListProps> = (props) => {
  const { className, ...rest } = props;

  const rootClassName = clsx(styles.tabList, className);

  const tabTitles = ChildPropsStore.useFromContext("TabTitle")
    .usePropsArray<TabProps>()
    .map((props, index) => {
      const tabId = props.id ?? String(index);
      return (
        <TabTitle id={tabId} key={tabId} shouldRender>
          {props.children}
        </TabTitle>
      );
    });

  return (
    <Aria.TabList className={rootClassName} {...rest}>
      {tabTitles}
    </Aria.TabList>
  );
};

export default TabList;
