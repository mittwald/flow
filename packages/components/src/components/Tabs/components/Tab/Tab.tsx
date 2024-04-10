import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./Tab.module.scss";
import clsx from "clsx";
import { useSetChildProps } from "@/lib/childProps";
import { TabContextProvider } from "@/components/Tabs/components/Tab/context";

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
    id,
    ...rest
  } = props;

  if (!shouldRender) {
    useSetChildProps("Tab", props);
    return null;
  }

  const rootClassName = clsx(styles.tabPanel, className);

  return (
    <Aria.TabPanel
      className={rootClassName}
      shouldForceMount={shouldForceMount}
      id={id}
      {...rest}
    >
      <TabContextProvider value={{ id }}>{children}</TabContextProvider>
    </Aria.TabPanel>
  );
};

export default Tab;
