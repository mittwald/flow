import type { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import locales from "../../../../locales/*.locale.json";
import ButtonView from "@/views/ButtonView";
import { IconSettings } from "@/components/Icon/components/icons";
import HeadingView from "@/views/HeadingView";
import { useLocalizedStringFormatter } from "react-aria";
import styles from "../../Header.module.css";
import { ViewModeMenuItem } from "@/components/List/components/Header/components/Settings/ViewModeMenuItem";
import { useAvailableViewModes } from "@/components/List/components/Header/lib";
import { SortingMenuItem } from "@/components/List/components/Header/components/Settings/SortingMenuItem";
import SeparatorView from "@/views/SeparatorView";
import ContextMenuSectionView from "@/views/ContextMenuSectionView";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";

export const SettingsMenu: FC = () => {
  const list = useList();

  const selectedViewMode = list.viewMode;
  const availableViewModes = useAvailableViewModes();
  const viewModeItems = availableViewModes.map((viewMode) => (
    <ViewModeMenuItem viewMode={viewMode} key={viewMode} />
  ));

  const sortingItems = list.visibleSorting.map((s) => (
    <SortingMenuItem sorting={s} key={s.id} />
  ));
  const labelSorting = list.visibleSorting.find((s) => s.isSorted());

  const stringFormatter = useLocalizedStringFormatter(locales);

  if (sortingItems.length === 0 && viewModeItems.length <= 1) {
    return null;
  }

  return (
    <ContextMenuTriggerView>
      <ButtonView
        className={styles.mobile}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.settings")}
      >
        <IconSettings />
      </ButtonView>

      <ContextMenuView>
        {viewModeItems.length > 1 && (
          <ContextMenuSectionView
            selectionMode="single"
            selectedKeys={[selectedViewMode]}
          >
            <HeadingView>
              {stringFormatter.format("list.settings.viewMode")}
            </HeadingView>
            {viewModeItems}
          </ContextMenuSectionView>
        )}

        {sortingItems.length > 0 && viewModeItems.length > 1 && (
          <SeparatorView />
        )}

        {sortingItems.length > 0 && (
          <ContextMenuSectionView
            selectionMode="single"
            selectedKeys={labelSorting ? [labelSorting.id] : []}
          >
            <HeadingView>{stringFormatter.format("list.sorting")}</HeadingView>
            {sortingItems}
          </ContextMenuSectionView>
        )}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
