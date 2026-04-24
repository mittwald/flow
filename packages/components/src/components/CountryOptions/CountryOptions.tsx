import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";
import type { ListBoxProps } from "react-aria-components";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import locales from "./locales/*.locale.json";
import { all, type CountryData } from "country-codes-list";
import { Option } from "@/components/Option";
import { uniqueBy } from "remeda";

export type Country = CountryData & {
  name: string;
  code: string;
};

export type CountryFilterFn = (country: Country) => boolean;
export type CountrySortFn = (left: Country, right: Country) => number;

export interface CountryOptionsProps<T = object>
  extends
    PropsWithChildren<Omit<ListBoxProps<T>, "children">>,
    FlowComponentProps {
  filterBy?: CountryFilterFn;
  sortBy?: CountrySortFn;
}

const defaultSortBy: CountrySortFn = (left, right) =>
  left.name.localeCompare(right.name);
const defaultFilterBy: CountryFilterFn = () => true;

// see https://github.com/Synergy-Shock/country-codes-list/issues/37
const uniqueCountries = uniqueBy(all(), (c) => c.countryCode);

export const CountryOptions: FC<CountryOptionsProps> = (props) => {
  const { filterBy = defaultFilterBy, sortBy = defaultSortBy } = props;
  const stringFormatter = useLocalizedStringFormatter(
    locales,
    "CountryOptions",
  );

  return useMemo(() => {
    return uniqueCountries
      .map((countryData) => ({
        ...countryData,
        code: countryData.countryCode,
        name: stringFormatter.format(`countryCode.${countryData.countryCode}`),
      }))
      .filter(filterBy)
      .sort(sortBy)
      .map((country) => (
        <Option
          key={country.countryNameEn}
          value={country.countryCode}
          textValue={country.name}
        >
          {country.name}
        </Option>
      ));
  }, [stringFormatter]);
};

export default CountryOptions;
