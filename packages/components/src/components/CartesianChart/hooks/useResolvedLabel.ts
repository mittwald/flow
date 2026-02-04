import { useEffect, useState } from "react";

/**
 * Resolve sync or async formatter labels into a React stateful value. This hook
 * will take core also when a function is defined in a Remote Context.
 *
 * @internal
 */
export const useResolvedLabel = <A extends readonly unknown[]>(
  formatter: (...args: A) => string | Promise<string>,
  args: A,
) => {
  const [value, setValue] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const formatterResult = formatter(...args);
      const resolvedFormattedValue =
        typeof formatterResult === "string"
          ? formatterResult
          : await formatterResult;

      if (!cancelled) {
        setValue(resolvedFormattedValue);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [formatter, ...args]);

  return value;
};
