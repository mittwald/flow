import type { PropsWithChildren } from "react";
import React, { useMemo } from "react";
import type { ListBoxProps } from "react-aria-components";
import { Option } from "@/components/Option";
import { useLocalizedStringFormatter } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import locales from "./locales/*.locale.json";

export interface Country {
  code: string;
  name: string;
}

export type CountryFilterFn = (country: Country) => boolean;
export type CountrySortFn = (left: Country, right: Country) => number;

export interface CountryOptionsProps<T = object>
  extends PropsWithChildren<Omit<ListBoxProps<T>, "children">>,
    FlowComponentProps {
  filterBy?: CountryFilterFn;
  sortBy?: CountrySortFn;
}

const countryCodes = Object.keys(locales["de-DE"])
  .filter((key) => key.startsWith("countries."))
  .map((key) => key.replace("countries.", ""));

const defaultSortBy: CountrySortFn = (left, right) =>
  left.name.localeCompare(right.name);
const voidSortBy: CountrySortFn = () => 0;
const defaultFilterBy: CountryFilterFn = () => true;

/** @flr-generate all */
export const CountryOptions = flowComponent(
  "CountryOptions",
  ({
    filterBy = defaultFilterBy,
    sortBy = voidSortBy,
  }: CountryOptionsProps) => {
    const stringFormatter = useLocalizedStringFormatter(locales);

    const countries = useMemo(
      () =>
        countryCodes
          .map((code) => ({
            code,
            name: stringFormatter.format(`countries.${code}`),
          }))
          .filter(filterBy)
          .sort(defaultSortBy)
          .sort(sortBy),
      [stringFormatter, filterBy, sortBy],
    );

    return (
      <>
        {countries.map((country) => (
          <Option key={country.code} value={country.code}>
            {country.name}
          </Option>
        ))}
      </>
    );
  },
);

export default CountryOptions;
