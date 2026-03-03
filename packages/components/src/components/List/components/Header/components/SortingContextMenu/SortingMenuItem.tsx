import type { FC } from "react";
import React from "react";
import type { Sorting } from "@/components/List/model/sorting/Sorting";
import MenuItemView from "@/views/MenuItemView";
import { useList } from "@/components/List";

interface Props {
  sorting: Sorting<never>;
}

export const SortingMenuItem: FC<Props> = (props) => {
  const { sorting } = props;

  const list = useList();

  return (
    <MenuItemView
      id={sorting.id}
      onAction={() => {
        list.getSorting(sorting.id).enable();
      }}
    >
      {`${sorting.name ?? sorting.property} ${sorting.directionName ?? ""}`.trim()}
    </MenuItemView>
  );
};
