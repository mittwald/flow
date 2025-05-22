import type { ListViewMode } from "@/components/List/model/types";
import { useList } from "@/components/List";

export const useAvailableViewModes = () => {
  const list = useList();

  const availableViewModes: ListViewMode[] = [];

  if (list.itemView?.showList) {
    availableViewModes.push("list");
  }
  if (list.table) {
    availableViewModes.push("table");
  }
  if (list.itemView?.showTiles) {
    availableViewModes.push("tiles");
  }

  return availableViewModes;
};
