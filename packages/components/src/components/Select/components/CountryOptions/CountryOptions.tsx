import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";
import type { ListBoxProps } from "react-aria-components";
import { Option } from "@/components/Select/components/Option";
import { useLocalizedStringFormatter } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import locales from "./locales/*.locale.json";
import type {
  CountrySortFn,
  CountrySortKey,
} from "@/components/Select/components/CountryOptions/components/CountrySort";
import { getCountrySort } from "@/components/Select/components/CountryOptions/components/CountrySort";

export interface CountryEntry {
  code: string;
  name: string;
  isDach: boolean;
}

export type CountryFilterFn = (country: CountryEntry) => boolean;

export interface CountryOptionsProps<T = object>
  extends PropsWithChildren<Omit<ListBoxProps<T>, "children">>,
    FlowComponentProps {
  filterBy?: CountryFilterFn;
  sortBy?: CountrySortFn | CountrySortKey;
}

export const CountryOptions = flowComponent(
  "CountryOptions",
  ({ filterBy = () => true, sortBy = "byName" }: CountryOptionsProps) => {
    const stringFormatter = useLocalizedStringFormatter(locales);
    const dachCountries = ["DE", "AT", "CH"];

    const countryCodes = useMemo(
      () =>
        Object.keys(locales["de-DE"])
          .filter((key) => key.startsWith("countries."))
          .map((key) => key.replace("countries.", "")),
      [],
    );

    const countryEntries = useMemo(
      () =>
        countryCodes
          .map((code) => ({
            code,
            name: stringFormatter.format(`countries.${code}`),
            isDach: dachCountries.includes(code),
          }))
          .filter(filterBy)
          .sort(getCountrySort(sortBy)),
      [countryCodes, stringFormatter, filterBy, sortBy],
    );

    return (
      <>
        {countryEntries.map((country) => (
          <Option key={country.code} value={country.code}>
            {country.name}
          </Option>
        ))}
      </>
    );
  },
);

export default CountryOptions;
