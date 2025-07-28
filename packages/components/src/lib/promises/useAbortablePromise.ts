import { type DependencyList, useLayoutEffect } from "react";

export const useAbortablePromise = (
  asyncFn: (signal: AbortSignal) => Promise<void>,
  dependencies: DependencyList,
) => {
  useLayoutEffect(() => {
    const controller = new AbortController();
    void asyncFn(controller.signal);
    return () => {
      controller.abort();
    };
  }, dependencies);
};
