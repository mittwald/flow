import { describe, expect, test } from "vitest";
import { sortByDachFirst } from "./sortBy";
import type { Country } from "@/components/CountryOptions/CountryOptions";

// The sort only ever reads `code` and `name`; the rest of `CountryData` is
// noise here.
const country = (code: string, name: string) => ({ code, name }) as Country;

const sorted = (countries: Country[]) =>
  [...countries].sort(sortByDachFirst).map((c) => c.code);

describe("sortByDachFirst", () => {
  test("DE, AT and CH lead in that order, whatever their names", () => {
    expect(
      sorted([
        country("CH", "Schweiz"),
        country("AT", "Österreich"),
        country("DE", "Deutschland"),
      ]),
    ).toEqual(["DE", "AT", "CH"]);
  });

  test("the DACH block comes before every other country", () => {
    expect(
      sorted([
        country("AL", "Albanien"),
        country("CH", "Schweiz"),
        country("ZW", "Simbabwe"),
        country("DE", "Deutschland"),
      ]),
    ).toEqual(["DE", "CH", "AL", "ZW"]);
  });

  test("the rest is sorted by name, not by code", () => {
    expect(
      sorted([
        country("US", "Vereinigte Staaten"),
        country("FR", "Frankreich"),
        country("BE", "Belgien"),
      ]),
    ).toEqual(["BE", "FR", "US"]);
  });

  test("names are compared by locale, so umlauts sort with their base letter", () => {
    expect(
      sorted([
        country("EG", "Ägypten"),
        country("AF", "Afghanistan"),
        country("BE", "Belgien"),
      ]),
    ).toEqual(["AF", "EG", "BE"]);
  });

  test("a country missing from DACH is not accidentally ranked by the map", () => {
    // `orderMap.get` returns undefined for these — a plain falsy check would
    // have ranked "DE" (index 0) as an outsider.
    expect(
      sorted([country("DK", "Dänemark"), country("DE", "Deutschland")]),
    ).toEqual(["DE", "DK"]);
  });
});
