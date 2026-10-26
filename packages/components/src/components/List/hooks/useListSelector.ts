import { useContext, useSyncExternalStore } from "react";
import { listContext } from "@/components/List/listContext";
import type List from "@/components/List/model/List";

/**
 * A value read from the list model, re-rendering only when it changes. The
 * selector has to return a primitive or a value that keeps its identity.
 */
export const useListSelector = <R, T = never>(
  selector: (list: List<T>) => R,
): R => {
  const { store } = useContext(listContext);
  const getValue = () => selector(store.getList() as unknown as List<T>);
  return useSyncExternalStore(store.subscribe, getValue, getValue);
};
