import type { FC, PropsWithChildren } from "react";
import React, { useId } from "react";
import type { TabPanelRenderProps } from "react-aria-components";
import * as Aria from "react-aria-components";
import styles from "./Tab.module.scss";
import clsx from "clsx";
import { TabContextProvider } from "@/components/Tabs/components/Tab/context";
import { TunnelEntry } from "@mittwald/react-tunnel";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface TabProps
  extends Omit<Aria.TabPanelProps, "children">,
    PropsWithChildren {}

export const Tab: FC<TabProps> = (props) => {
  const { children, className, id: idFromProps, ...rest } = props;

  const rootClassName = clsx(styles.tabPanel, className);

  const generatedId = useId();
  const id = idFromProps ?? generatedId;

  const TabPanelRenderer: FC<TabPanelRenderProps> = (props) => {
    const isSelected = props.state.selectedKey === id;

    const propsContext: PropsContext = {
      Content: {
        isActive: isSelected,
      },
      Section: {
        isActive: isSelected,
      },
    };

    return (
      <PropsContextProvider
        props={propsContext}
        dependencies={[isSelected, children]}
      >
        {children}
      </PropsContextProvider>
    );
  };

  return (
    <TunnelEntry id="Panels">
      <TabContextProvider value={{ id }}>
        <Aria.TabPanel
          className={rootClassName}
          shouldForceMount
          id={id}
          {...rest}
        >
          {TabPanelRenderer}
        </Aria.TabPanel>
      </TabContextProvider>
    </TunnelEntry>
  );
};

export default Tab;
