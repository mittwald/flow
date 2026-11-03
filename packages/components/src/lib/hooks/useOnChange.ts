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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the caller passes the callback's dependencies
  }, [value, callback, ...dependencies]);
};
