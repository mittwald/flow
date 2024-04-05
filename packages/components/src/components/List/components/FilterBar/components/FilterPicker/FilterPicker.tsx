import type { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import { FilterPickerItem } from "@/components/List/components/FilterBar/components/FilterPickerItem";
import React from "react";

export const FilterPicker: FC = () => {
  const list = useList();

  return list.filters.map((filter) => (
    <FilterPickerItem key={filter.property} filter={filter} />
  ));
};
