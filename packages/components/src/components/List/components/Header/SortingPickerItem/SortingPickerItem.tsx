import type { FC } from "react";
import React from "react";
import type { AnyData } from "@/components/List/model/item/types";
import type { Sorting } from "@/components/List/model/sorting/Sorting";
import { MenuItem } from "@/components/ContextMenu";

interface Props {
  sorting: Sorting<AnyData>;
}

export const SortingPickerItem: FC<Props> = (props) => {
  const { sorting } = props;

  return <MenuItem id={sorting.getTableColumn().id}>{sorting.name}</MenuItem>;
};
