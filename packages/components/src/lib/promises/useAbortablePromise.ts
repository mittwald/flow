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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the caller passes the function's dependencies
  }, dependencies);
};
