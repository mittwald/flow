import { TabList } from "@/components/Tabs/components/TabList";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";
import * as Aria from "react-aria-components";
import styles from "./Tabs.module.scss";
import { FallbackTab } from "@/components/Tabs/components/FallbackTab";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { useIsSSR } from "react-aria";

export interface TabsProps
  extends
    Omit<Aria.TabsProps, "children">,
    PropsWithChildren,
    FlowComponentProps {
  /**
   * An accessible name for the tab list. `Tabs` has no `Label` slot, so this is
   * how the group is named when the surrounding heading does not already do
   * it.
   */
  "aria-label"?: string;
  /** The id of an element that names the tab list. */
  "aria-labelledby"?: string;
  /**
   * The view rendered when the selected tab does not exist. Defaults to a
   * built-in IllustratedMessage.
   */
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
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  } = props;

  const rootClassName = clsx(styles.tabs, className);
  const [selectedKeyState, setSelectedKeyState] = useState<
    Aria.Key | undefined
  >(defaultSelectedKey);

  const selectedKey = selectedKeyProps ?? selectedKeyState;

  const isSsr = useIsSSR();

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
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
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
        {!isSsr && <FallbackTab tabNotFoundView={tabNotFoundView} />}
      </Aria.Tabs>
    </>
  );
});

export default Tabs;
