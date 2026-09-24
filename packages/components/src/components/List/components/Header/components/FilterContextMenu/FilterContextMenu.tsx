import type { FC } from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import { IconFilter } from "@/components/Icon/components/icons";
import TextView from "@/views/TextView";
import ButtonView from "@/views/ButtonView";
import { FilterMenuItem } from "@/components/List/components/Header/components/FilterContextMenu/FilterMenuItem";
import styles from "@/components/List/components/Header/Header.module.scss";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";
import {
  FilterSelectAllMenuItem,
  filterSelectAllMenuItemId,
} from "@/components/List/components/Header/components/FilterContextMenu/FilterSelectAllMenuItem";

interface Props {
  filter: Filter;
  isDisabled?: boolean;
}

export const FilterContextMenu: FC<Props> = (props) => {
  const { filter, isDisabled } = props;

  const { values, mode, name, property } = filter;

  const selectionMode = mode === "one" ? "single" : "multiple";

  const filterItems = values.map((v) => (
    <FilterMenuItem filterValue={v} key={v.id} selectionMode={selectionMode} />
  ));

  const selectAllItem = filter.isSelectAllAvailable && (
    <FilterSelectAllMenuItem filter={filter} />
  );

  const activeFilterKeys = values.filter((v) => v.isActive).map((v) => v.id);

  if (selectAllItem && filter.isEveryValueActive()) {
    activeFilterKeys.push(filterSelectAllMenuItemId);
  }

  return (
    <ContextMenuTriggerView>
      <ButtonView
        className={styles.hideOnMobile}
        variant="outline"
        color="secondary"
        isDisabled={isDisabled}
      >
        <TextView>{name ?? property}</TextView>
        <IconFilter />
      </ButtonView>
      <ContextMenuView
        selectionMode={selectionMode}
        selectedKeys={activeFilterKeys}
      >
        {selectAllItem}
        {filterItems}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
