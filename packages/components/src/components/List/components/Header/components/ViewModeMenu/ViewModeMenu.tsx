import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List";
import type { ListViewMode } from "~/components/List/model/types";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";

export const ViewModeMenu: FC = () => {
  const list = useList();
  const selectedViewMode = list.viewMode;

  const Views = {
    ViewModeMenu: useViewComponent(
      "ListViewModeMenuView",
      ListViews.ViewModeMenu,
    ),
  };

  const availableViewModes: ListViewMode[] = [];
  if (list.itemView) {
    availableViewModes.push("list");
  }
  if (list.table) {
    availableViewModes.push("table");
  }

  return (
    <Views.ViewModeMenu
      selectedViewMode={selectedViewMode}
      availableViewModes={availableViewModes}
      onViewModeSelected={(m) => list.setViewMode(m)}
    />
  );
};
