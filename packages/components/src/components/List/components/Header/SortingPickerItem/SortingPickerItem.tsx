import type { FC } from "react";
import React from "react";
import type { Sorting } from "@/components/List/model/sorting/Sorting";
import { MenuItem } from "@/components/ContextMenu";

interface Props {
  sorting: Sorting<never>;
}

export const SortingPickerItem: FC<Props> = (props) => {
  const { sorting } = props;

  return <MenuItem id={sorting.id}>{sorting.name}</MenuItem>;
};
