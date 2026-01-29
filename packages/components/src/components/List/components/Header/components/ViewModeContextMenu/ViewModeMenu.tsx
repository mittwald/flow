import type { FC } from "react";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { useList } from "@/components/List";
import { IconView } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import TextView from "@/views/TextView";
import { ViewModeMenuItem } from "@/components/List/components/Header/components/ViewModeContextMenu/ViewModeMenuItem";
import { useAvailableViewModes } from "@/components/List/components/Header/lib";
import styles from "@/components/List/components/Header/Header.module.css";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";

export const ViewModeMenu: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales);
  const list = useList();
  const selectedViewMode = list.viewMode;

  const availableViewModes = useAvailableViewModes();

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <ContextMenuTriggerView>
      <ButtonView
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.settings")}
        className={styles.desktop}
      >
        <TextView>
          {stringFormatter.format(`list.settings.viewMode.${selectedViewMode}`)}
        </TextView>
        <IconView />
      </ButtonView>
      <ContextMenuView selectionMode="single" selectedKeys={[selectedViewMode]}>
        {availableViewModes.map((viewMode) => (
          <ViewModeMenuItem viewMode={viewMode} key={viewMode} />
        ))}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
