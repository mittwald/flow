import { TabList } from "@/components/Tabs/components/TabList";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";
import * as Aria from "react-aria-components";
import styles from "./Tabs.module.scss";
import { FallbackTab } from "@/components/Tabs/components/FallbackTab";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface TabsProps
  extends
    Omit<Aria.TabsProps, "children">,
    PropsWithChildren,
    FlowComponentProps {
  /* custom fallback view for not found tabs */
  tabNotFoundView?: ReactNode;
}

/** @flr-generate all */
export const Tabs = flowComponent("Tabs", (props) => {
  const {
    children,
    className,
    defaultSelectedKey,
    selectedKey: selectedKeyProps,
    disabledKeys,
    ref,
    onSelectionChange,
    tabNotFoundView,
    ...rest
  } = props;

  const rootClassName = clsx(styles.tabs, className);
  const [selectedKeyState, setSelectedKeyState] = useState<
    Aria.Key | undefined
  >(defaultSelectedKey);

  const selectedKey = selectedKeyProps ?? selectedKeyState;

  return (
    <>
      {children}
      <Aria.Tabs
        slot={null}
        className={rootClassName}
        {...rest}
        selectedKey={selectedKey}
        onSelectionChange={(key) => {
          setSelectedKeyState(key);
          if (onSelectionChange) {
            onSelectionChange(key);
          }
        }}
        disabledKeys={disabledKeys}
        ref={ref}
      >
        <TabList
          selection={selectedKey}
          onContextMenuSelectionChange={(key) => {
            setSelectedKeyState(key);
            if (onSelectionChange) {
              onSelectionChange(key);
            }
          }}
          disabledKeys={disabledKeys}
        />
        <UiComponentTunnelExit id="Panels" component="Tabs" />
        <FallbackTab tabNotFoundView={tabNotFoundView} />
      </Aria.Tabs>
    </>
  );
});

export default Tabs;
