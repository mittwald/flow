import type { FC } from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import { IconFilter } from "@/components/Icon/components/icons";
import TextView from "@/views/TextView";
import ButtonView from "@/views/ButtonView";
import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";
import { FilterMenuItem } from "@/components/List/components/Header/components/Filters/FilterMenuItem";
import styles from "@/components/List/components/Header/Header.module.css";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterMenu: FC<Props> = (props) => {
  const { filter } = props;

  const { values, mode, name, property } = filter;

  const filterItems = values.map((v) => (
    <FilterMenuItem filterValue={v} key={v.id} />
  ));

  const activeFilterKeys = values.filter((v) => v.isActive).map((v) => v.id);

  return (
    <ContextMenuTrigger>
      <ButtonView
        className={styles.desktop}
        variant="outline"
        color="secondary"
      >
        <TextView>{name ?? property}</TextView>
        <IconFilter />
      </ButtonView>
      <ContextMenu
        selectionMode={mode === "one" ? "single" : "multiple"}
        selectedKeys={activeFilterKeys}
      >
        {filterItems}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
