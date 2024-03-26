import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "./TabPanel.module.scss";
import clsx from "clsx";

export interface TabPanelProps extends Aria.TabPanelProps {}

export const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tabPanel, className);

  return (
    <Aria.TabPanel className={rootClassName} {...rest}>
      {children}
    </Aria.TabPanel>
  );
};

export default TabPanel;
