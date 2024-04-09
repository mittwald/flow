import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabList.module.scss";
import type { TabTitleProps } from "@/components/Tabs";

export interface TabListProps extends Aria.TabListProps<TabTitleProps> {}

export const TabList: FC<TabListProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tabList, className);

  return (
    <Aria.TabList className={rootClassName} {...rest}>
      {children}
    </Aria.TabList>
  );
};

export default TabList;
