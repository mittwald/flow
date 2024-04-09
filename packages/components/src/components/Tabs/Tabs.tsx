import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tabs.module.scss";

export interface TabsProps extends Aria.TabsProps {}

export const Tabs: FC<TabsProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tabs, className);

  return (
    <Aria.Tabs className={rootClassName} {...rest}>
      {children}
    </Aria.Tabs>
  );
};

export default Tabs;
