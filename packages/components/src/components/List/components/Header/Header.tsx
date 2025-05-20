import type { FC } from "react";
import React from "react";
import styles from "./Header.module.css";
import clsx from "clsx";
import { ActiveFilters } from "@/components/List/components/Header/components/ActiveFilters";
import { useList } from "@/components/List/hooks/useList";
import type { PropsWithClassName } from "@/lib/types/props";
import { SearchField } from "@/components/List/components/Header/components/SearchField/SearchField";
import { ViewModeMenu } from "@/components/List/components/Header/components/Settings/ViewModeMenu";
import { TunnelExit } from "@mittwald/react-tunnel";
import DivView from "@/views/DivView";
import { SettingsMenu } from "@/components/List/components/Header/components/Settings/SettingsMenu";
import { SortingMenu } from "@/components/List/components/Header/components/Settings/SortingMenu";
import { FilterMenuList } from "@/components/List/components/Header/components/Filters/FilterMenuList";
import { CombinedFilterMenu } from "@/components/List/components/Header/components/Filters/CombinedFilterMenu";

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

  return (
    <DivView className={clsx(className, styles.header)}>
      <DivView className={styles.headerContent}>
        <TunnelExit id="actions" />
        <DivView className={styles.options}>
          {/* Desktop */}
          <ViewModeMenu />
          <SortingMenu />
          <FilterMenuList />

          {/* Mobile */}
          <SettingsMenu />
          <CombinedFilterMenu />

          {list.search && <SearchField search={list.search} />}
        </DivView>
      </DivView>
      <ActiveFilters />
    </DivView>
  );
};

export default Header;
