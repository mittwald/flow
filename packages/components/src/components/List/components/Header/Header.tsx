import type { FC } from "react";
import React from "react";
import styles from "./Header.module.css";
import clsx from "clsx";
import { ActiveFilters } from "@/components/List/components/Header/components/ActiveFilters";
import { useList } from "@/components/List/hooks/useList";
import type { PropsWithClassName } from "@/lib/types/props";
import { SearchField } from "@/components/List/components/Header/components/SearchField/SearchField";
import { ViewModeContextMenu } from "@/components/List/components/Header/components/ViewModeContextMenu/ViewModeContextMenu";
import { TunnelExit } from "@mittwald/react-tunnel";
import DivView from "@/views/DivView";
import { SortingContextMenu } from "@/components/List/components/Header/components/SortingContextMenu/SortingContextMenu";
import { FilterContextMenus } from "@/components/List/components/Header/components/FilterContextMenu/FilterContextMenus";
import { AllFiltersModal } from "@/components/List/components/Header/components/AllFiltersModal/AllFiltersModal";
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
            <ViewModeContextMenu />
            <SortingContextMenu />
            <FilterContextMenus />
            <AllFiltersModal />

            {list.search && <SearchField search={list.search} />}
          </DivView>
        )}
      </DivView>
      <ActiveFilters />
    </DivView>
  );
};

export default Header;
