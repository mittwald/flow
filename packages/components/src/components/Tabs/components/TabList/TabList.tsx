import React, { FC } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabList.module.scss";
import { TabProps } from "@/components/Tabs";

export interface TabListProps extends Aria.TabListProps<TabProps> {}

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
