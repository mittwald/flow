import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import type { ListViewMode } from "@/components/List/model/types";
import { ViewModeMenu as View } from "@/components/List/viewComponents/Header/ViewModeMenu";

export const ViewModeMenu: FC = () => {
  const list = useList();
  const selectedViewMode = list.viewMode;

  const availableViewModes: ListViewMode[] = [];
  if (list.itemView) {
    availableViewModes.push("list");
  }
  if (list.table) {
    availableViewModes.push("table");
  }

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <View
      selectedViewMode={selectedViewMode}
      availableViewModes={availableViewModes}
      onViewModeSelected={(m) => list.setViewMode(m)}
    />
  );
};
