import type { PropsWithChildren } from "react";
import React from "react";
import { Select, SelectProps } from "@/components/Select";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { Option } from "@/components/Select/components/Option";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface CountrySelectProps
  extends PropsWithChildren<
      Omit<SelectProps, "children">
    >,
    FlowComponentProps,
    PropsWithClassName {
  /** Optional flag to show DACH countries at the beginning of the list */
  dachFirst?: boolean;
}

export const CountrySelect = flowComponent(
  "CountrySelect",
  (props: CountrySelectProps) => {
    const {
      dachFirst = false,
      className,
      children,
      ...rest
    } = props;

    const stringFormatter = useLocalizedStringFormatter(locales);
    const dachCountries = ["DE", "AT", "CH"];
    const countryCodes = Object.keys(locales["de-DE"])
      .filter(key => key.startsWith('countries.'))
      .map(key => key.replace('countries.', ''));
    const countryEntries = countryCodes.map((code) => ({
      code,
      name: stringFormatter.format(`countries.${code}`),
      isDach: dachCountries.includes(code),
    }));

    const sortedCountries = [...countryEntries].sort((a, b) => {
      if (dachFirst) {
        if (a.isDach && !b.isDach) return -1;
        if (!a.isDach && b.isDach) return 1;
      }
      return a.name.localeCompare(b.name);
    });

    return (
      <Select
        {...rest}
        className={className}
      >
        {children}
        {sortedCountries.map((country) => (
          <Option key={country.code} value={country.code}>
            {country.name}
          </Option>
        ))}
      </Select>
    );
  },
);

export default CountrySelect;
