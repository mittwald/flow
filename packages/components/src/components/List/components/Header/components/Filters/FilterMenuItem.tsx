import MenuItemView from "@/views/MenuItemView";
import React, { type FC } from "react";
import type { FilterValue } from "@/components/List/model/filter/FilterValue";

interface Props {
  filterValue: FilterValue;
}

export const FilterMenuItem: FC<Props> = (props) => {
  const { filterValue } = props;

  return (
    <MenuItemView
      id={filterValue.id}
      key={filterValue.id}
      onAction={() => {
        filterValue.toggle();
      }}
    >
      {filterValue.render()}
    </MenuItemView>
  );
};
