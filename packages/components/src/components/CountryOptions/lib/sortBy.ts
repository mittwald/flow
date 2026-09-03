import type { CountrySortFn } from "@/components/CountryOptions/CountryOptions";

const dachCountries = ["DE", "AT", "CH"];

const orderMap = new Map(dachCountries.map((c, i) => [c, i]));

export const sortByDachFirst: CountrySortFn = (a, b) => {
  const aRank = orderMap.get(a.code);
  const bRank = orderMap.get(b.code);

  const aInDach = aRank !== undefined;
  const bInDach = bRank !== undefined;

  if (aInDach && bInDach) {
    return aRank - bRank;
  }
  if (aInDach) {
    return -1;
  }
  if (bInDach) {
    return 1;
  }

  return a.name.localeCompare(b.name);
};
