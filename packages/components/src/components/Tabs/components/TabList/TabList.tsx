import type { FC } from "react";
import { useId } from "react";
import * as Aria from "react-aria-components";
import styles from "./TabList.module.scss";
import { TunnelExit } from "@mittwald/react-tunnel";
import { useObserveOverflow } from "@/lib/hooks/dom/useObserveOverflow";
import { Button } from "@/components/Button";
import { IconContextMenu } from "@/components/Icon/components/icons";
import clsx from "clsx";
import TabTitleCollapsed from "@/components/Tabs/components/TabTitle/TabTitleCollapsed";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";

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
      <TunnelExit id="Titles" />
    </Aria.TabList>
  );

  const singleTabTitleWhenCollapsed = isCollapsed && (
    <TabTitleCollapsed id={titleCollapsedElementId} />
  );

  const contextMenuWhenCollapsed = isCollapsed && (
    <ContextMenuTriggerView>
      <Button
        variant="soft"
        className={styles.contextMenuButton}
        color="secondary"
        aria-labelledby={titleCollapsedElementId}
      >
        <IconContextMenu />
      </Button>

      <ContextMenuView
        disabledKeys={disabledKeys}
        selectedKeys={selection ? [selection] : undefined}
        selectionMode="navigation"
        onAction={(key) => handleContextMenuSelectionChange(key)}
      >
        <TunnelExit id="ContextMenuItems" />
      </ContextMenuView>
    </ContextMenuTriggerView>
  );

  return (
    <div className={rootClassName}>
      {regularTabTitles}
      {singleTabTitleWhenCollapsed}
      {contextMenuWhenCollapsed}
    </div>
  );
};
