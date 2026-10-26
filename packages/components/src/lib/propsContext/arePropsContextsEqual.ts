import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";

const isObject = (something: unknown): something is Record<string, unknown> =>
  typeof something === "object" && something !== null;

/**
 * Compares two props contexts level by level. Component levels are compared
 * recursively, prop values by identity – an inline callback or element counts
 * as a change.
 */
export const arePropsContextsEqual = (
  first: unknown,
  second: unknown,
): boolean => {
  if (Object.is(first, second)) {
    return true;
  }

  if (!isObject(first) || !isObject(second)) {
    return false;
  }

  const firstKeys = Object.keys(first);

  if (firstKeys.length !== Object.keys(second).length) {
    return false;
  }

  return firstKeys.every(
    (key) =>
      Object.hasOwn(second, key) &&
      (isFlowComponentName(key)
        ? arePropsContextsEqual(first[key], second[key])
        : Object.is(first[key], second[key])),
  );
};

export default arePropsContextsEqual;
