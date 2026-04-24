import type { FC } from "react";
import { useId } from "react";
import * as Aria from "react-aria-components";
import styles from "./TabList.module.scss";
import { useObserveOverflow } from "@/lib/hooks/dom/useObserveOverflow";
import { Button } from "@/components/Button";
import clsx from "clsx";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

interface Props {
  selection: Aria.Key | undefined;
  onContextMenuSelectionChange: (key: Aria.Key) => void;
  disabledKeys?: Iterable<Aria.Key>;
}

export const TabList: FC<Props> = (props) => {
  const { selection, disabledKeys, onContextMenuSelectionChange } = props;

  const titleCollapsedElementId = useId();
  const overflowObserver = useObserveOverflow();
  const isCollapsed = overflowObserver.isOverflowing;
  const rootClassName = clsx(styles.tabList, isCollapsed && styles.collapsed);

  const handleContextMenuSelectionChange = (key: Aria.Key) => {
    onContextMenuSelectionChange(key);
  };

  const regularTabTitles = (
    <Aria.TabList className={styles.titles} ref={overflowObserver.ref}>
      <UiComponentTunnelExit id="Titles" component="Tabs" />
    </Aria.TabList>
  );

  const contextMenuWhenCollapsed = isCollapsed && (
    <ContextMenuTriggerView>
      <Button
        variant="solid"
        className={styles.contextMenuButton}
        color="light"
        aria-labelledby={titleCollapsedElementId}
      >
        <UiComponentTunnelExit id="ActiveTitle" component="Tabs" />
        <IconChevronDown />
      </Button>

      <ContextMenuView
        disabledKeys={disabledKeys}
        selectedKeys={selection ? [selection] : undefined}
        selectionMode="navigation"
        onAction={(key) => handleContextMenuSelectionChange(key)}
      >
        <UiComponentTunnelExit id="ContextMenuItems" component="Tabs" />
      </ContextMenuView>
    </ContextMenuTriggerView>
  );

  return (
    <div className={rootClassName}>
      {regularTabTitles}
      {contextMenuWhenCollapsed}
    </div>
  );
};
