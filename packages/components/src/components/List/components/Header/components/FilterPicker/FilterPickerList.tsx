import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import type { PropsWithClassName } from "@/lib/types/props";
import { FilterPicker } from "@/components/List/components/Header/components/FilterPicker/FilterPicker";

interface Props extends PropsWithClassName {
  hasActionGroup?: boolean;
}

export const FilterPickerList: FC<Props> = (props) => {
  const { hasActionGroup } = props;
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

  return list.filters.map((filter) => (
    <FilterPicker key={filter.property} filter={filter} />
  ));
};
