import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import { FilterContextMenu } from "@/components/List/components/Header/components/FilterContextMenu/FilterContextMenu";
import { DateRangeFilterPopover } from "@/components/List/components/Header/components/FilterContextMenu/DateRangeFilterPopover";
import { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";

export const FilterContextMenus: FC = () => {
  const list = useList();

  return list.filters
    .filter((f) => f.priority === "primary")
    .map((filter) =>
      filter instanceof DateRangeFilter ? (
        <DateRangeFilterPopover
          key={filter.property}
          filter={filter as DateRangeFilter<never, never>}
        />
      ) : (
        <FilterContextMenu key={filter.property} filter={filter} />
      ),
    );
};
