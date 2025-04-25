import { useMemo } from "react";
import type { DependencyList } from "react";

interface Awaiter<T = undefined> {
  promise: Promise<T>;
  resolve: T extends undefined ? () => void : (res: T) => void;
  reject: (error: unknown) => void;
}

export function useAwaiter<T = undefined>(
  deps: DependencyList = [],
): Awaiter<T> {
  return useMemo(() => {
    let resolve: (res: T) => void;
    let reject: (error: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve: (res) => {
        resolve(res);
      },
      reject: (error) => {
        reject(error);
      },
    } as Awaiter<T>;
  }, deps);
}
