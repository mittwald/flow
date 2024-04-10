import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tabs.module.scss";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface TabsProps
  extends Omit<Aria.TabsProps, "children">,
    PropsWithChildren {}

export const Tabs: FC<TabsProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tabs, className);

  return (
    <TunnelProvider>
      <Aria.Tabs className={rootClassName} {...rest}>
        <Aria.TabList className={styles.tabList}>
          <TunnelExit id="TabTitles" />
        </Aria.TabList>
        <TunnelExit id="TabPanels" />
      </Aria.Tabs>
      {children}
    </TunnelProvider>
  );
};

export default Tabs;
