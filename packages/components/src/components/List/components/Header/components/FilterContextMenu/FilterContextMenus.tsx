import type { FC } from "react";
import { useList } from "@/components/List";
import { FilterContextMenu } from "@/components/List/components/Header/components/FilterContextMenu/FilterContextMenu";
import { DateRangeFilterPopover } from "@/components/List/components/Header/components/FilterContextMenu/DateRangeFilterPopover";
import { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";

interface Props {
  isDisabled?: boolean;
}

export const FilterContextMenus: FC<Props> = (props) => {
  const { isDisabled } = props;
  const list = useList();

  return list.filters
    .filter((f) => f.priority === "primary")
    .map((filter) =>
      filter instanceof DateRangeFilter ? (
        <DateRangeFilterPopover
          key={filter.property}
          filter={filter}
          isDisabled={isDisabled}
        />
      ) : (
        <FilterContextMenu
          key={filter.property}
          filter={filter}
          isDisabled={isDisabled}
        />
      ),
    );
};
