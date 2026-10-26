import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";

const isObject = (something: unknown): something is Record<string, unknown> =>
  typeof something === "object" && something !== null;

const isRefObject = (something: Record<string, unknown>) => {
  const keys = Object.keys(something);
  return keys.length === 1 && keys[0] === "current";
};

const isPlainObject = (
  something: unknown,
): something is Record<string, unknown> => {
  if (!isObject(something) || "$$typeof" in something) {
    return false;
  }
  const prototype = Object.getPrototypeOf(something);
  return (
    (prototype === Object.prototype || prototype === null) &&
    !isRefObject(something)
  );
};

const areValuesEqual = (first: unknown, second: unknown): boolean =>
  Object.is(first, second) ||
  (isPlainObject(first) &&
    isPlainObject(second) &&
    arePropsContextsEqual(first, second));

/**
 * Compares two props contexts level by level. Component levels and plain
 * objects (a `tunnel`, a `dynamic(...)` prop) are compared recursively, all
 * other values by identity – an inline callback, element or ref counts as a
 * change.
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
        : areValuesEqual(first[key], second[key])),
  );
};

export default arePropsContextsEqual;
