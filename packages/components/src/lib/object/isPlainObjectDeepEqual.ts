const isRefObject = (something: object) => {
  const keys = Object.keys(something);
  return keys.length === 1 && keys[0] === "current";
};

const isPlainObject = (
  something: unknown,
): something is Record<string, unknown> => {
  if (
    typeof something !== "object" ||
    something === null ||
    "$$typeof" in something
  ) {
    return false;
  }
  const prototype = Object.getPrototypeOf(something);
  return (
    (prototype === Object.prototype || prototype === null) &&
    !isRefObject(something)
  );
};

/**
 * Compares plain objects recursively and every other value by identity.
 * Functions, arrays, class instances, React elements and ref objects (`{
 * current }`) only count as equal when they are the same value, so a value
 * created during render counts as a change.
 */
export const isPlainObjectDeepEqual = (
  first: unknown,
  second: unknown,
): boolean => {
  if (Object.is(first, second)) {
    return true;
  }

  if (!isPlainObject(first) || !isPlainObject(second)) {
    return false;
  }

  const firstKeys = Object.keys(first);

  if (firstKeys.length !== Object.keys(second).length) {
    return false;
  }

  return firstKeys.every(
    (key) =>
      Object.hasOwn(second, key) &&
      isPlainObjectDeepEqual(first[key], second[key]),
  );
};

export default isPlainObjectDeepEqual;
