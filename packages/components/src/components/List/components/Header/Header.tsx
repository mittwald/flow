import type { FC } from "react";
import React from "react";
import { SortingPicker } from "@/components/List/components/Header/components/SortingPicker";
import FilterPicker from "@/components/List/components/Header/components/FilterPicker";
import styles from "./Header.module.css";
import clsx from "clsx";
import { ActiveFilters } from "@/components/List/components/Header/components/ActiveFilters";
import { useList } from "@/components/List/hooks/useList";
import type { PropsWithClassName } from "@/lib/types/props";
import { SearchField } from "@/components/List/components/Header/components/SearchField/SearchField";
import { ViewModeMenu } from "@/components/List/components/Header/components/ViewModeMenu/ViewModeMenu";
import { TunnelExit } from "@mittwald/react-tunnel";

interface Props extends PropsWithClassName {
  hasActionGroup?: boolean;
}

export const Header: FC<Props> = (props) => {
  const { className, hasActionGroup } = props;
  const list = useList();

  if (
    list.filters.length === 0 &&
    list.visibleSorting.length === 0 &&
    !list.search &&
    !list.table &&
    !(list.itemView?.showTiles && list.itemView?.showList) &&
    !hasActionGroup
  ) {
    return null;
  }

  const filterPickerList = list.filters.map((filter) => (
    <FilterPicker key={filter.property} filter={filter} />
  ));

  return (
    <div className={clsx(className, styles.header)}>
      <div className={styles.pickerListAndSearch}>
        <div className={styles.pickerList}>
          <ViewModeMenu />
          <SortingPicker />
          {filterPickerList}
        </div>
        <div className={styles.searchAndActions}>
          {list.search && (
            <SearchField className={styles.searchField} search={list.search} />
          )}
          <TunnelExit id="actions" />
        </div>
      </div>
      <ActiveFilters />
    </div>
  );
};

export default Header;
