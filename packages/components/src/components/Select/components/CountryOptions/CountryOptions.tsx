import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";
import type { ListBoxProps } from "react-aria-components";
import { Option } from "@/components/Select/components/Option";
import { useLocalizedStringFormatter } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import locales from "./locales/*.locale.json";

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
  /** Optional flag to prioritize DACH countries */
  dachFirst?: boolean;
}

export const CountryOptions = flowComponent(
  "CountryOptions",
  ({ filterBy = () => true, dachFirst = false }: CountryOptionsProps) => {
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
          .sort((a, b) => {
            if (dachFirst) {
              if (a.isDach && !b.isDach) return -1;
              if (!a.isDach && b.isDach) return 1;
            }
            return a.name.localeCompare(b.name);
          }),
      [countryCodes, stringFormatter, filterBy, dachFirst],
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
