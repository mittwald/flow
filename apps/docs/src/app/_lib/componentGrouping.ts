"use client";
import { useCallback, useSyncExternalStore } from "react";

export type ComponentGrouping = "grouped" | "alphabetical";

const componentGroupingStorageKey = "@mittwald/flow-docs/component-grouping";

const getDefaultGrouping = (): ComponentGrouping => "grouped";

const listeners = new Set<() => void>();

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

const getSnapshot = (): ComponentGrouping =>
  localStorage.getItem(componentGroupingStorageKey) === "alphabetical"
    ? "alphabetical"
    : getDefaultGrouping();

export const useComponentGrouping = () => {
  const grouping = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getDefaultGrouping,
  );

  const setGrouping = useCallback((grouping: ComponentGrouping) => {
    localStorage.setItem(componentGroupingStorageKey, grouping);
    listeners.forEach((listener) => listener());
  }, []);

  return { grouping, setGrouping };
};
