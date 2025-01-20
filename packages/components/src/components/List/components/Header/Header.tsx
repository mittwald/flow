import type { FC } from "react";
import React from "react";
import { SortingPicker } from "~/components/List/components/Header/components/SortingPicker";
import FilterPicker from "~/components/List/components/Header/components/FilterPicker";
import styles from "./Header.module.css";
import clsx from "clsx";
import { ActiveFilters } from "~/components/List/components/Header/components/ActiveFilters";
import { useList } from "~/components/List/hooks/useList";
import type { PropsWithClassName } from "~/lib/types/props";
import { SearchField } from "~/components/List/components/Header/components/SearchField/SearchField";
import { ViewModeMenu } from "~/components/List/components/Header/components/ViewModeMenu/ViewModeMenu";
import { TunnelExit } from "@mittwald/react-tunnel";
import DivView from "~/views/DivView";

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
    !hasActionGroup
  ) {
    return null;
  }

  const filterPickerList = list.filters.map((filter) => (
    <FilterPicker key={filter.property} filter={filter} />
  ));

  return (
    <DivView className={clsx(className, styles.header)}>
      <DivView className={styles.pickerListAndSearch}>
        <DivView className={styles.pickerList}>
          <ViewModeMenu />
          <SortingPicker />
          {filterPickerList}
        </DivView>
        <DivView className={styles.searchAndActions}>
          {list.search && (
            <SearchField className={styles.searchField} search={list.search} />
          )}
          <TunnelExit id="actions" />
        </DivView>
      </DivView>
      <ActiveFilters />
    </DivView>
  );
};

export default Header;
