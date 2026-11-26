import { useCallback, useLayoutEffect, useRef } from "react";
import type List from "@/components/List/model/List";

/**
 * A stable invoker of the list's latest `onAction`, or `undefined` without one.
 * An event handler only ever needs to be the latest one, so items and rows do
 * not re-render for an inline `onAction`.
 */
export const useLatestOnAction = (list: List<never>) => {
  const onActionRef = useRef(list.onAction);
  useLayoutEffect(() => {
    onActionRef.current = list.onAction;
  });
  const invokeOnAction = useCallback(
    (data: never) => onActionRef.current?.(data),
    [],
  );
  return list.onAction ? invokeOnAction : undefined;
};
