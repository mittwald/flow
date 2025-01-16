import type { FC } from "react";
import React from "react";
import type { Sorting } from "~/components/List/model/sorting/Sorting";
import { MenuItem } from "~/components/ContextMenu";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";

interface Props {
  sorting: Sorting<never>;
}

export const SortingPickerItem: FC<Props> = (props) => {
  const { sorting } = props;
  const { MenuItemView } = useViewComponents(["MenuItem", MenuItem]);
  return <MenuItemView id={sorting.id}>{sorting.name}</MenuItemView>;
};
