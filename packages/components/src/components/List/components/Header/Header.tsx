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
import { SortingMenu } from "@/components/List/components/Header/components/Settings/SortingMenu";
import { FilterMenuList } from "@/components/List/components/Header/components/Filters/FilterMenuList";
import { CombinedFilterMenu } from "@/components/List/components/Header/components/Filters/CombinedFilterMenu";
import { useAvailableViewModes } from "@/components/List/components/Header/lib";

export const Header: FC<PropsWithClassName> = (props) => {
  const { className } = props;
  const list = useList();

  const availableViewModes = useAvailableViewModes();

  const hasOptions =
    list.filters.length > 0 ||
    list.visibleSorting.length > 0 ||
    list.search ||
    availableViewModes.length > 1;

  return (
    <DivView
      className={clsx(
        className,
        styles.header,
        list.search && styles.withSearch,
      )}
    >
      <DivView className={styles.headerContent}>
        <TunnelExit id="actions" />
        {hasOptions && (
          <DivView className={styles.options}>
            {/* Desktop */}
            <ViewModeMenu />
            <SortingMenu />
            <FilterMenuList />

            {/* Mobile */}
            <CombinedFilterMenu />

            {list.search && <SearchField search={list.search} />}
          </DivView>
        )}
      </DivView>
      <ActiveFilters />
    </DivView>
  );
};

export default Header;
