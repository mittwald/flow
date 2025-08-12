import type { CountrySortFn } from "@/components/CountryOptions/CountryOptions";

const dachCountries = ["DE", "AT", "CH"];

export const sortByDachFirst: CountrySortFn = (left, right) =>
  dachCountries.includes(right.code)
    ? 1
    : 0 - (dachCountries.includes(left.code) ? 1 : 0);
