import type { PropsWithChildren } from "react";
import React from "react";
import { Select } from "@/components/Select";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { Option } from "@/components/Select/components/Option";
import { CountryList } from "@/components/CountrySelect/components/CountryList";

export interface CountrySelectProps
  extends PropsWithChildren<
      Omit<
        React.ComponentProps<typeof Select>,
        "children" | "className" | "defaultSelectedKey"
      >
    >,
    FlowComponentProps,
    PropsWithClassName {
  /** Optional default selected country code */
  defaultCountry?: string;
  /** Optional callback when country selection changes */
  onCountryChange?: (countryCode: string) => void;
  /** Optional flag to show DACH countries at the beginning of the list */
  dachFirst?: boolean;
}

export const CountrySelect = flowComponent(
  "CountrySelect",
  (props: CountrySelectProps) => {
    const {
      defaultCountry,
      onCountryChange,
      dachFirst = false,
      className,
      children,
      ...rest
    } = props;

    const dachCountries = ["DE", "AT", "CH"];

    const countryEntries = Object.entries(CountryList).map(([code, name]) => ({
      code,
      name,
      isDach: dachCountries.includes(code),
    }));

    const sortedCountries = [...countryEntries].sort((a, b) => {
      if (dachFirst) {
        if (a.isDach && !b.isDach) return -1;
        if (!a.isDach && b.isDach) return 1;
      }
      return a.name.localeCompare(b.name, "de");
    });

    return (
      <Select
        {...rest}
        className={className}
        defaultSelectedKey={defaultCountry}
        onSelectionChange={(key) => {
          onCountryChange?.(String(key));
        }}
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
