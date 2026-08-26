"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { ComponentGrouping } from "@/app/_lib/componentGrouping";
import {
  componentGroupingStorageKey,
  defaultComponentGrouping,
  parseComponentGrouping,
} from "@/app/_lib/componentGrouping";

const listeners = new Set<() => void>();

const applyGrouping = (grouping: ComponentGrouping) => {
  document.documentElement.dataset.componentGrouping = grouping;
  listeners.forEach((listener) => listener());
};

const subscribe = (onStoreChange: () => void) => {
  const onStorage = () =>
    applyGrouping(
      parseComponentGrouping(localStorage.getItem(componentGroupingStorageKey)),
    );

  listeners.add(onStoreChange);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
};

const getSnapshot = (): ComponentGrouping =>
  parseComponentGrouping(document.documentElement.dataset.componentGrouping);

const getServerSnapshot = (): ComponentGrouping => defaultComponentGrouping;

export const useComponentGrouping = () => {
  const grouping = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setGrouping = useCallback((grouping: ComponentGrouping) => {
    localStorage.setItem(componentGroupingStorageKey, grouping);
    applyGrouping(grouping);
  }, []);

  return { grouping, setGrouping };
};
