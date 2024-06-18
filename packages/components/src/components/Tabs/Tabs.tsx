import type { PropsWithChildren } from "react";
import React, { useState } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tabs.module.scss";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { TabList } from "@/components/Tabs/components/TabList";
import { useIsSSR } from "react-aria";

export interface TabsProps
  extends Omit<Aria.TabsProps, "children">,
    PropsWithChildren,
    FlowComponentProps {}

export const Tabs = flowComponent("Tabs", (props) => {
  const {
    children,
    className,
    defaultSelectedKey,
    disabledKeys,
    refProp: ref,
    ...rest
  } = props;

  const rootClassName = clsx(styles.tabs, className);

  const isSSR = useIsSSR();

  const anchorId = isSSR ? undefined : window.location.hash.slice(1);

  const [selection, setSelection] = useState<Aria.Key | undefined>(
    anchorId || defaultSelectedKey,
  );

  return (
    <TunnelProvider>
      {children}
      <Aria.Tabs
        slot={null}
        className={rootClassName}
        {...rest}
        selectedKey={selection}
        onSelectionChange={setSelection}
        disabledKeys={disabledKeys}
        ref={ref}
      >
        <TabList
          selection={selection}
          onContextMenuSelectionChange={setSelection}
          disabledKeys={disabledKeys}
        />
        <TunnelExit id="Panels" />
      </Aria.Tabs>
    </TunnelProvider>
  );
});

export default Tabs;
