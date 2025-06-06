import type { RefObject } from "react";
import { useCallback, useMemo, useRef } from "react";

export function useObjectRef<T>(
  ref?:
    | ((instance: T | null) => (() => void) | void)
    | RefObject<T | null>
    | null,
): RefObject<T | null> {
  const objRef: RefObject<T | null> = useRef<T>(null);
  const cleanupRef: RefObject<(() => void) | void> = useRef(undefined);

  const refEffect = useCallback(
    (instance: T | null) => {
      if (typeof ref === "function") {
        const refCallback = ref;
        const refCleanup = refCallback(instance);
        return () => {
          if (typeof refCleanup === "function") {
            refCleanup();
          } else {
            refCallback(null);
          }
        };
      } else if (ref) {
        ref.current = instance;
        return () => {
          ref.current = null;
        };
      }
    },
    [ref],
  );

  return useMemo(
    () => ({
      get current() {
        return objRef.current;
      },
      set current(value) {
        objRef.current = value;
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = undefined;
        }

        if (value != null) {
          cleanupRef.current = refEffect(value);
        }
      },
    }),
    [refEffect],
  );
}
