import type { FC, PropsWithChildren } from "react";
import { useId } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./Tab.module.scss";
import clsx from "clsx";
import { TabContextProvider } from "@/components/Tabs/components/Tab/context";
import { TunnelEntry } from "@mittwald/react-tunnel";

export interface TabProps
  extends Omit<Aria.TabPanelProps, "children">,
    PropsWithChildren {}

export const Tab: FC<TabProps> = (props) => {
  const {
    children,
    className,
    shouldForceMount = true,
    id: idFromProps,
    ...rest
  } = props;

  const rootClassName = clsx(styles.tabPanel, className);

  const generatedId = useId();
  const id = idFromProps ?? generatedId;

  return (
    <TunnelEntry id="TabPanels">
      <TabContextProvider value={{ id }}>
        <Aria.TabPanel
          className={rootClassName}
          shouldForceMount={shouldForceMount}
          id={id}
          {...rest}
        >
          {children}
        </Aria.TabPanel>
      </TabContextProvider>
    </TunnelEntry>
  );
};

export default Tab;
