import type { FC } from "react";
import styles from "./Header.module.css";
import clsx from "clsx";
import { ActiveFilters } from "@/components/List/components/Header/components/ActiveFilters";
import { useList } from "@/components/List/hooks/useList";
import type { PropsWithClassName } from "@/lib/types/props";
import { SearchField } from "@/components/List/components/Header/components/SearchField/SearchField";
import { ViewModeContextMenu } from "@/components/List/components/Header/components/ViewModeContextMenu/ViewModeContextMenu";
import DivView from "@/views/DivView";
import { SortingContextMenu } from "@/components/List/components/Header/components/SortingContextMenu/SortingContextMenu";
import { FilterContextMenus } from "@/components/List/components/Header/components/FilterContextMenu/FilterContextMenus";
import { AllFiltersModal } from "@/components/List/components/Header/components/AllFiltersModal/AllFiltersModal";
import { useAvailableViewModes } from "@/components/List/components/Header/lib";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

export const Header: FC<PropsWithClassName> = (props) => {
  const { className } = props;
  const list = useList();

  const isEmpty = list.useIsEmpty();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const noItemsAvailable = isEmpty && list.getEmptyViewType() === "list";
  const isDisabled = isInitiallyLoading || noItemsAvailable;

  const availableViewModes = useAvailableViewModes();

  const hasOptions =
    list.filters.length > 0 ||
    list.visibleSorting.length > 0 ||
    list.search ||
    availableViewModes.length > 1;

  if (noItemsAvailable) {
    return;
  }

  return (
    <DivView
      className={clsx(
        className,
        styles.header,
        list.search && styles.withSearch,
      )}
    >
      <DivView className={styles.headerContent}>
        <UiComponentTunnelExit id="actions" component="List" />
        {hasOptions && (
          <DivView className={styles.options}>
            <ViewModeContextMenu isDisabled={isDisabled} />
            <SortingContextMenu isDisabled={isDisabled} />
            <FilterContextMenus isDisabled={isDisabled} />
            <AllFiltersModal isDisabled={isDisabled} />

            {list.search && (
              <SearchField search={list.search} isDisabled={isDisabled} />
            )}
          </DivView>
        )}
      </DivView>
      <ActiveFilters isDisabled={isDisabled} />
    </DivView>
  );
};

export default Header;
