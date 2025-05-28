import { type DependencyList, useEffect } from "react";

interface Signal {
  aborted: boolean;
}

export const useAbortablePromise = (
  asyncFn: (signal: Signal) => Promise<void>,
  dependencies: DependencyList,
) => {
  useEffect(() => {
    const signal = { aborted: false };
    void asyncFn(signal);
    return () => {
      signal.aborted = true;
    };
  }, dependencies);
};
