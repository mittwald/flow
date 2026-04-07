import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";
import type { ListBoxProps } from "react-aria-components";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import locales from "./locales/*.locale.json";
import OptionView from "@/views/OptionView";
import { all, type CountryData } from "country-codes-list";

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
const voidSortBy: CountrySortFn = () => 0;
const defaultFilterBy: CountryFilterFn = () => true;

export const CountryOptions: FC<CountryOptionsProps> = (props) => {
  const { filterBy = defaultFilterBy, sortBy = voidSortBy } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  return useMemo(() => {
    return all()
      .map((countryData) => ({
        ...countryData,
        code: countryData.countryCode,
        name: stringFormatter.format(
          `countryOptions.${countryData.countryCode}`,
        ),
      }))
      .filter(filterBy)
      .sort(defaultSortBy)
      .sort(sortBy)
      .map((country) => (
        <OptionView
          key={`${country.countryCode}-${country.countryNameEn}`}
          value={country.countryCode}
        >
          {country.name}
        </OptionView>
      ));
  }, [stringFormatter, filterBy, sortBy]);
};

export default CountryOptions;
