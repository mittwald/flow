import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tabs.module.scss";
import { TabList } from "@/components/Tabs/components/TabList";
import { ChildPropsContextProvider } from "@/lib/childProps";
import { TabPanels } from "@/components/Tabs/components/TabPanels";

export interface TabsProps
  extends Omit<Aria.TabsProps, "children">,
    PropsWithChildren {}

export const Tabs: FC<TabsProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tabs, className);

  return (
    <ChildPropsContextProvider scope="Tab">
      <ChildPropsContextProvider scope="TabTitle">
        <Aria.Tabs className={rootClassName} {...rest}>
          <TabList />
          <TabPanels />
        </Aria.Tabs>
        {children}
      </ChildPropsContextProvider>
    </ChildPropsContextProvider>
  );
};

export default Tabs;
