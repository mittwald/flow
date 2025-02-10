import { useLocale } from "react-aria-components";
import { useMemo } from "react";
import type {
  LocalizedString,
  LocalizedStrings,
} from "@internationalized/string";
import {
  LocalizedStringDictionary,
  LocalizedStringFormatter,
} from "@internationalized/string";

const useLocalizedStringFormatter = <
  K extends string = string,
  T extends LocalizedString = string,
>(
  strings: LocalizedStrings<K, T>,
  defaultFallbackLocale = "en-EN",
) => {
  const { locale } = useLocale();
  const fallbackLocale = useMemo(() => {
    return Object.keys(strings).pop() ?? defaultFallbackLocale;
  }, [strings, defaultFallbackLocale]);

  const dictionary = new LocalizedStringDictionary<K, T>(
    strings,
    fallbackLocale,
  );

  dictionary.getStringForLocale = (key: K, locale: string) => {
    if (!(locale in strings)) {
      if (!(fallbackLocale in strings)) {
        console.error(
          "i18n",
          `tried to translate [\`${key}\`] with fallbackLocal [${fallbackLocale}] but not found`,
          `using requested key as resolved translation string`,
        );

        return key as never as T;
      }

      console.warn(
        "i18n",
        `tried to translate [\`${key}\`] with locale [${locale}] but not found`,
        `using fallback locale [${fallbackLocale}]`,
      );
      return strings[fallbackLocale][key];
    }

    return strings[locale][key];
  };

  return useMemo(
    () => new LocalizedStringFormatter(locale, dictionary),
    [locale, dictionary],
  );
};

export default useLocalizedStringFormatter;
