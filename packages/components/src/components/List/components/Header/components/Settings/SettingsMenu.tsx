import type { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";
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
    <ContextMenuTrigger>
      <ButtonView
        className={styles.mobile}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.settings")}
      >
        <IconSettings />
      </ButtonView>

      <ContextMenu>
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
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
