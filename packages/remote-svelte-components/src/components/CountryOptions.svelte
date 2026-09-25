<script lang="ts" module>
  import { all, type CountryData } from "country-codes-list";
  import { uniqueBy } from "remeda";

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
</script>

<script lang="ts">
  import Option from "../auto-generated/Option.svelte";
  import { useLanguage } from "../lib/remoteContext.svelte.js";

  /**
   * The countries of the world, as `Option`s for a `Select` or `ComboBox`.
   *
   * Flow ships the country names as locale files. Here they come from
   * `Intl.DisplayNames` in the host's language, which is the same data every
   * browser already carries — no translation files to keep in sync, at the
   * price of the browser's spelling rather than Flow's.
   */
  interface Props {
    filterBy?: CountryFilterFn;
    sortBy?: CountrySortFn;
  }

  const {
    filterBy = defaultFilterBy,
    sortBy = defaultSortBy,
  }: Props = $props();

  const language = useLanguage();

  const countries = $derived.by(() => {
    const displayNames = new Intl.DisplayNames([language.current ?? "en-US"], {
      type: "region",
    });

    return uniqueCountries
      .map((countryData) => ({
        ...countryData,
        code: countryData.countryCode,
        name:
          displayNames.of(countryData.countryCode) ?? countryData.countryNameEn,
      }))
      .filter(filterBy)
      .sort(sortBy);
  });
</script>

{#each countries as country (country.code)}<Option
    value={country.code}
    textValue={country.name}
  >{country.name}</Option>{/each}
