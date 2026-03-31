import MenuItemView from "@/views/MenuItemView";
import { type FC } from "react";
import type { FilterValue } from "@/components/List/model/filter/FilterValue";
import type { ContextMenuSelectionMode } from "@/components/ContextMenu/lib";

interface Props {
  filterValue: FilterValue;
  selectionMode?: ContextMenuSelectionMode;
}

export const FilterMenuItem: FC<Props> = (props) => {
  const { filterValue, selectionMode } = props;

  return (
    <MenuItemView
      id={filterValue.id}
      onAction={() => {
        if (selectionMode === "multiple" || !filterValue.isActive) {
          filterValue.toggle();
        }
      }}
    >
      {filterValue.render()}
    </MenuItemView>
  );
};
