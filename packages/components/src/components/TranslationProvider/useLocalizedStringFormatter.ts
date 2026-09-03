import {
  type Translations,
  useTranslationProvider,
} from "@/components/TranslationProvider/TranslationProvider";
import { mergeDeep } from "remeda";
import type { FlowComponentName } from "@/components/propTypes";
import { mapValues, pick } from "remeda";
import type {
  Variables,
  LocalizedStrings as LocalizedStringsIntl,
} from "@internationalized/string";
import IntlMessageFormat from "intl-messageformat";
import { useLocalizedStringDictionary } from "@react-aria/i18n";
import { useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";

export type LocalizedStrings = LocalizedStringsIntl<string, string>;
export type LocalizedComponentName = FlowComponentName | string;

export type TranslationFunction = (
  key: string,
  variables: Variables,
  meta: {
    component: string;
    locale: string;
  },
) => string | undefined;

const pickComponentTranslations = (
  componentName: LocalizedComponentName,
  data?: Translations,
) => {
  if (!data) {
    return {};
  }

  return mapValues(data, (components) => {
    const picked = pick(components ?? {}, [componentName]);
    return picked[componentName] ?? {};
  });
};

export const useLocalizedStringFormatter = (
  strings: LocalizedStrings,
  componentName: LocalizedComponentName,
) => {
  const locale = useLanguage();
  const { translations, translate } = useTranslationProvider();

  const mergedStrings = useMemo(
    () =>
      mergeDeep(
        strings,
        pickComponentTranslations(componentName, translations),
      ),
    [strings, translations, componentName],
  );

  const dictionary = useLocalizedStringDictionary(mergedStrings, componentName);
  const formatFunction = useCallback(
    (key: string, variables?: Variables): string => {
      if (translate) {
        const customTranslated = translate(key, variables, {
          component: componentName,
          locale,
        });

        if (customTranslated !== undefined) {
          return customTranslated;
        }
      }

      const translationString = dictionary.getStringForLocale(key, locale);
      const translationMessage = new IntlMessageFormat(
        translationString,
        locale,
      );

      return String(translationMessage.format(variables));
    },
    [translate, locale, componentName, dictionary],
  );

  return useMemo(() => ({ format: formatFunction }), [formatFunction]);
};
