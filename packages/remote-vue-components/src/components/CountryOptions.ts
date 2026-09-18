import { Option } from "@/auto-generated";
import { useLanguage } from "@/composables/remoteContext";
import { all, type CountryData } from "country-codes-list";
import { uniqueBy } from "remeda";
import { defineComponent, h, type PropType } from "vue";

export type Country = CountryData & {
  name: string;
  code: string;
};

export type CountryFilterFn = (country: Country) => boolean;
export type CountrySortFn = (left: Country, right: Country) => number;

// see https://github.com/Synergy-Shock/country-codes-list/issues/37
const uniqueCountries = uniqueBy(all(), (c) => c.countryCode);

const defaultSortBy: CountrySortFn = (left, right) =>
  left.name.localeCompare(right.name);
const defaultFilterBy: CountryFilterFn = () => true;

/**
 * The countries of the world, as `Option`s for a `Select` or `ComboBox`.
 *
 * Flow ships the country names as locale files. Here they come from
 * `Intl.DisplayNames` in the host's language, which is the same data every
 * browser already carries — no translation files to keep in sync, at the price
 * of the browser's spelling rather than Flow's.
 */
export const CountryOptions = defineComponent({
  name: "CountryOptions",

  props: {
    filterBy: {
      type: Function as PropType<CountryFilterFn>,
      default: defaultFilterBy,
    },
    sortBy: {
      type: Function as PropType<CountrySortFn>,
      default: defaultSortBy,
    },
  },

  setup(props) {
    const language = useLanguage();

    return () => {
      const displayNames = new Intl.DisplayNames([language.value ?? "en-US"], {
        type: "region",
      });

      return uniqueCountries
        .map((countryData) => ({
          ...countryData,
          code: countryData.countryCode,
          name:
            displayNames.of(countryData.countryCode) ??
            countryData.countryNameEn,
        }))
        .filter(props.filterBy)
        .sort(props.sortBy)
        .map((country) =>
          h(
            Option,
            { key: country.code, value: country.code, textValue: country.name },
            () => country.name,
          ),
        );
    };
  },
});

export default CountryOptions;
