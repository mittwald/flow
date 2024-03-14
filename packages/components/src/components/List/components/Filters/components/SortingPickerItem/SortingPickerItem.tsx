import React, { FC } from "react";
import {
  IconChevronDown,
  IconChevronUp,
} from "@/components/Icon/components/icons";
import { Empty } from "@/lib/react/components/Empty";
import { AnyData } from "@/components/List/model/item/types";
import { Sorting } from "@/components/List/model/sorting/Sorting";
import { ContextMenuItem } from "@/components/ContextMenu";

interface Props {
  sorting: Sorting<AnyData>;
}

export const SortingPickerItem: FC<Props> = (props) => {
  const { sorting } = props;

  const direction = sorting.direction;

  const SortingIcon =
    direction === "asc"
      ? IconChevronUp
      : direction === "desc"
        ? IconChevronDown
        : Empty;

  //const isSorted = direction !== false;

  return (
    <ContextMenuItem id={sorting.getTableColumn().id}>
      {sorting.getTableColumn().id}
      <SortingIcon size="s" />
    </ContextMenuItem>
  );
};
