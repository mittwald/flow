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

  const filterSections = list.filters.map((f) => {
    const activeKeys = f.values.filter((v) => v.isActive).map((v) => v.id);
    return (
      <ContextMenuSectionView
        key={f.property}
        selectionMode={f.mode === "one" ? "single" : "multiple"}
        selectedKeys={activeKeys}
      >
        <HeadingView>{f.name ?? f.property}</HeadingView>
        {f.values.map((v) => (
          <FilterMenuItem key={v.id} filterValue={v} />
        ))}
      </ContextMenuSectionView>
    );
  });

  const availableViewModes = useAvailableViewModes();
  const selectedViewMode = list.viewMode;
  const viewModeSection =
    availableViewModes.length > 1 ? (
      <ContextMenuSectionView
        selectionMode="single"
        selectedKeys={[selectedViewMode]}
      >
        <HeadingView>
          {stringFormatter.format("list.settings.viewMode")}
        </HeadingView>
        {availableViewModes.map((vm) => (
          <ViewModeMenuItem key={vm} viewMode={vm} />
        ))}
      </ContextMenuSectionView>
    ) : null;

  const sortingItems = list.visibleSorting.map((s) => (
    <SortingMenuItem key={s.id} sorting={s} />
  ));
  const labelSorting = list.visibleSorting.find((s) => s.isSorted());
  const sortingSection =
    sortingItems.length > 0 ? (
      <ContextMenuSectionView
        selectionMode="single"
        selectedKeys={labelSorting ? [labelSorting.id] : []}
      >
        <HeadingView>{stringFormatter.format("list.sorting")}</HeadingView>
        {sortingItems}
      </ContextMenuSectionView>
    ) : null;

  const sections = [viewModeSection, sortingSection, ...filterSections].filter(
    Boolean,
  );

  if (sections.length === 0) return null;

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
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {index > 0 && <SeparatorView />}
            {section}
          </React.Fragment>
        ))}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
