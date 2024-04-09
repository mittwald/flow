import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./Tab.module.scss";
import clsx from "clsx";

export interface TabProps
  extends Omit<Aria.TabPanelProps, "children">,
    PropsWithChildren {
  /** @internal */
  shouldRender?: boolean;
}

export const Tab: FC<TabProps> = (props) => {
  const {
    children,
    className,
    shouldRender = false,
    shouldForceMount = true,
    ...rest
  } = props;

  if (!shouldRender) {
    return null;
  }

  const rootClassName = clsx(styles.tabPanel, className);

  return (
    <Aria.TabPanel
      className={rootClassName}
      shouldForceMount={shouldForceMount}
      {...rest}
    >
      {children}
    </Aria.TabPanel>
  );
};

export default Tab;
