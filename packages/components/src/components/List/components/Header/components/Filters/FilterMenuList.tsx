import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import { FilterMenu } from "@/components/List/components/Header/components/Filters/FilterMenu";

export const FilterMenuList: FC = () => {
  const list = useList();

  return list.filters.map((filter) => (
    <FilterMenu key={filter.property} filter={filter} />
  ));
};
