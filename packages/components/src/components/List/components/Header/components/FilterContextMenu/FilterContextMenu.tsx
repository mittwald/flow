import type { FC } from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import { IconFilter } from "@/components/Icon/components/icons";
import TextView from "@/views/TextView";
import ButtonView from "@/views/ButtonView";
import { FilterMenuItem } from "@/components/List/components/Header/components/FilterContextMenu/FilterMenuItem";
import styles from "@/components/List/components/Header/Header.module.css";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterContextMenu: FC<Props> = (props) => {
  const { filter } = props;

  const { values, mode, name, property } = filter;

  const filterItems = values.map((v) => (
    <FilterMenuItem filterValue={v} key={v.id} />
  ));

  const activeFilterKeys = values.filter((v) => v.isActive).map((v) => v.id);

  return (
    <ContextMenuTriggerView>
      <ButtonView
        className={styles.desktop}
        variant="outline"
        color="secondary"
      >
        <TextView>{name ?? property}</TextView>
        <IconFilter />
      </ButtonView>
      <ContextMenuView
        selectionMode={mode === "one" ? "single" : "multiple"}
        selectedKeys={activeFilterKeys}
      >
        {filterItems}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
