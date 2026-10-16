import type { DependencyList } from "react";

export const dependenciesAreEqual = (a?: DependencyList, b?: DependencyList) =>
  a === b ||
  (!!a &&
    !!b &&
    a.length === b.length &&
    a.every((dependency, index) => Object.is(dependency, b[index])));

export const shallowEqual = (a: object, b: object) => {
  const aEntries = Object.entries(a);
  return (
    aEntries.length === Object.keys(b).length &&
    aEntries.every(([key, value]) =>
      Object.is(value, (b as Record<string, unknown>)[key]),
    )
  );
};
