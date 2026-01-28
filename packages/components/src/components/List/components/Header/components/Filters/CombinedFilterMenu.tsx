import type { FC } from "react";
import React from "react";
import { IconFilter } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import { useList } from "@/components/List";
import HeadingView from "@/views/HeadingView";
import { FilterMenuItem } from "@/components/List/components/Header/components/Filters/FilterMenuItem";
import styles from "@/components/List/components/Header/Header.module.css";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";
import ContextMenuSectionView from "@/views/ContextMenuSectionView";
import SeparatorView from "@/views/SeparatorView";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";
import { useAvailableViewModes } from "@/components/List/components/Header/lib";
import { ViewModeMenuItem } from "@/components/List/components/Header/components/Settings/ViewModeMenuItem";
import { SortingMenuItem } from "@/components/List/components/Header/components/Settings/SortingMenuItem";

export const CombinedFilterMenu: FC = () => {
  const list = useList();

  const stringFormatter = useLocalizedStringFormatter(locales);

  const filters = list.filters;
  const filterItems = filters.map((f, i) => {
    const activeFilterKeys = f.values
      .filter((v) => v.isActive)
      .map((v) => v.id);

    return (
      <React.Fragment key={f.property}>
        <ContextMenuSectionView
          selectionMode={f.mode === "one" ? "single" : "multiple"}
          selectedKeys={activeFilterKeys}
        >
          <HeadingView>{f.name ?? f.property}</HeadingView>
          {f.values.map((v) => (
            <FilterMenuItem key={v.id} filterValue={v} />
          ))}
        </ContextMenuSectionView>
        {i + 1 < filters.length && <SeparatorView />}
      </React.Fragment>
    );
  });
  const showFilters = filters.length > 0;

  const selectedViewMode = list.viewMode;
  const availableViewModes = useAvailableViewModes();
  const viewModeItems = availableViewModes.map((viewMode) => (
    <ViewModeMenuItem viewMode={viewMode} key={viewMode} />
  ));
  const showViewMode = viewModeItems.length > 1;

  const sortingItems = list.visibleSorting.map((s) => (
    <SortingMenuItem sorting={s} key={s.id} />
  ));
  const labelSorting = list.visibleSorting.find((s) => s.isSorted());
  const showSorting = sortingItems.length > 0;

  if (!showSorting && !showViewMode && !showFilters) {
    return null;
  }

  return (
    <ContextMenuTriggerView>
      <ButtonView
        className={styles.mobile}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.filters")}
      >
        <IconFilter />
      </ButtonView>
      <ContextMenuView>
        {showViewMode && (
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

        {showViewMode && showSorting && <SeparatorView />}

        {showSorting && (
          <ContextMenuSectionView
            selectionMode="single"
            selectedKeys={labelSorting ? [labelSorting.id] : []}
          >
            <HeadingView>{stringFormatter.format("list.sorting")}</HeadingView>
            {sortingItems}
          </ContextMenuSectionView>
        )}

        {(showSorting || showViewMode) && showFilters && <SeparatorView />}

        {filterItems}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
