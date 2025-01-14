import type { PropsWithChildren } from "react";
import React, { useState } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tabs.module.scss";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { FlowComponentProps } from "~/lib/componentFactory/flowComponent";
import { flowComponent } from "~/lib/componentFactory/flowComponent";
import { TabList } from "~/components/Tabs/components/TabList";

export interface TabsProps
  extends Omit<Aria.TabsProps, "children">,
    PropsWithChildren,
    FlowComponentProps {}

/** @flr-generate all */
export const Tabs = flowComponent("Tabs", (props) => {
  const {
    children,
    className,
    defaultSelectedKey,
    disabledKeys,
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(styles.tabs, className);
  const [selection, setSelection] = useState<Aria.Key | undefined>(
    defaultSelectedKey,
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
