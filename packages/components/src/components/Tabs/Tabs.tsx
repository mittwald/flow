import { TabList } from "@/components/Tabs/components/TabList";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import * as Aria from "react-aria-components";
import styles from "./Tabs.module.scss";

export interface TabsProps
  extends
    Omit<Aria.TabsProps, "children">,
    PropsWithChildren,
    FlowComponentProps {}

/** @flr-generate all */
export const Tabs = flowComponent("Tabs", (props) => {
  const {
    children,
    className,
    defaultSelectedKey,
    selectedKey,
    disabledKeys,
    ref,
    onSelectionChange,
    ...rest
  } = props;

  const rootClassName = clsx(styles.tabs, className);
  const [selection, setSelection] = useState<Aria.Key | undefined>(
    selectedKey ?? defaultSelectedKey,
  );

  return (
    <TunnelProvider>
      {children}
      <Aria.Tabs
        slot={null}
        className={rootClassName}
        {...rest}
        selectedKey={selection}
        onSelectionChange={(key) => {
          setSelection(key);
          if (onSelectionChange) {
            onSelectionChange(key);
          }
        }}
        disabledKeys={disabledKeys}
        ref={ref}
      >
        <TabList
          selection={selection}
          onContextMenuSelectionChange={(key) => {
            setSelection(key);
            if (onSelectionChange) {
              onSelectionChange(key);
            }
          }}
          disabledKeys={disabledKeys}
        />
        <TunnelExit id="Panels" />
      </Aria.Tabs>
    </TunnelProvider>
  );
});

export default Tabs;
