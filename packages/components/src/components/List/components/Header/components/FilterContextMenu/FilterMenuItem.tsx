import MenuItemView from "@/views/MenuItemView";
import SkeletonTextView from "@/views/SkeletonTextView";
import { Suspense, type FC } from "react";
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
        if (selectionMode === "single" && !filterValue.isActive) {
          filterValue.toggle();
        }
      }}
    >
      {/* A suspension that reaches the boundary around the menu loops ("Maximum update depth exceeded"). */}
      <Suspense fallback={<SkeletonTextView width="8em" />}>
        {filterValue.render()}
      </Suspense>
    </MenuItemView>
  );
};
