import type { DependencyList } from "react";
import { useEffect, useRef } from "react";

export const useOnChange = (
  value: unknown,
  callback: () => void,
  dependencies: DependencyList = [],
) => {
  const oldValue = useRef(value);

  useEffect(() => {
    if (oldValue.current !== value) {
      callback();
    }
    oldValue.current = value;
  }, [value, callback, ...dependencies]);
};
