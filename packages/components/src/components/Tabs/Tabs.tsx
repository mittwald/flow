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

  /*
   * `null` — not `undefined` — is what keeps `Aria.Tabs` controlled while
   * nothing is selected yet. The tab titles reach the tab list through a
   * tunnel, so the collection is still empty on the first render and react-aria
   * only picks the default tab in the following commit. With `undefined`,
   * `Aria.Tabs` starts out uncontrolled and flips to controlled as soon as that
   * selection lands in `selectedKeyState` — the transition React and
   * react-aria warn about.
   *
   * react-aria's `TabListProps` narrows `selectedKey` to `Key`, while the state
   * hook behind it reads `null` as "controlled, nothing selected"
   * (`useControlledState` treats only `undefined` as uncontrolled). The cast at
   * the call site bridges that gap.
   */
  const selectedKey = selectedKeyProps ?? selectedKeyState ?? null;

  const isSsr = useIsSSR();

  return (
    <>
      {children}
      <Aria.Tabs
        slot={null}
        className={rootClassName}
        {...rest}
        selectedKey={selectedKey as Aria.Key | undefined}
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
