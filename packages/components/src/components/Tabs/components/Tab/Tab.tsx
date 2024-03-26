import React, { FC } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tab.module.scss";

export interface TabProps extends Aria.TabProps {}

export const Tab: FC<TabProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tab, className);

  return (
    <Aria.Tab className={rootClassName} {...rest}>
      {children}
    </Aria.Tab>
  );
};

export default Tab;
