import type { FC } from "react";
import React from "react";
import type { Sorting } from "@/components/List/model/sorting/Sorting";
import MenuItemView from "@/views/MenuItemView";

interface Props {
  sorting: Sorting<never>;
}

export const SortingPickerItem: FC<Props> = (props) => {
  const { sorting } = props;
  return <MenuItemView id={sorting.id}>{sorting.name}</MenuItemView>;
};
