import type { CountryEntry } from "@/components/Select/components/CountryOptions/CountryOptions";

export type CountrySortFn = (a: CountryEntry, b: CountryEntry) => number;

interface CountrySortFunctions {
  byName: CountrySortFn;
  byCode: CountrySortFn;
  dachFirst: CountrySortFn;
}

interface CountrySortFactories {
  createDachFirst: (baseSortFn?: CountrySortFn) => CountrySortFn;
}

export const countrySorts: CountrySortFunctions & CountrySortFactories = {
  byName: (a, b) => a.name.localeCompare(b.name),
  byCode: (a, b) => a.code.localeCompare(b.code),
  dachFirst: (a, b) => {
    if (a.isDach && !b.isDach) return -1;
    if (!a.isDach && b.isDach) return 1;
    return a.name.localeCompare(b.name);
  },

  createDachFirst:
    (baseSortFn = countrySorts.byName) =>
    (a, b) => {
      if (a.isDach && !b.isDach) return -1;
      if (!a.isDach && b.isDach) return 1;
      return baseSortFn(a, b);
    },
};

export type CountrySortKey = keyof CountrySortFunctions;

export const getCountrySort = (
  sortFn: CountrySortFn | CountrySortKey,
): CountrySortFn => {
  if (typeof sortFn === "function") {
    return sortFn;
  }

  const isValidSortKey = (key: string): key is keyof CountrySortFunctions => {
    return (
      key in countrySorts &&
      typeof countrySorts[key as keyof typeof countrySorts] === "function"
    );
  };

  if (!isValidSortKey(sortFn)) {
    return countrySorts.byName;
  }

  return countrySorts[sortFn];
};
