import { useContext, useSyncExternalStore } from "react";
import { listContext } from "@/components/List/listContext";
import type List from "@/components/List/model/List";

/** The list model, re-rendering on every render of the list. */
export const useList = <T = never>() => {
  const { store } = useContext(listContext);
  return useSyncExternalStore(
    store.subscribe,
    store.getList,
    store.getList,
  ) as unknown as List<T>;
};
