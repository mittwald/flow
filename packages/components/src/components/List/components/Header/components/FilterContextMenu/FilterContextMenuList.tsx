import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import { FilterContextMenu } from "@/components/List/components/Header/components/FilterContextMenu/FilterContextMenu";

export const FilterContextMenuList: FC = () => {
  const list = useList();

  return list.filters
    .filter((f) => f.priority === "primary")
    .map((filter) => (
      <FilterContextMenu key={filter.property} filter={filter} />
    ));
};
