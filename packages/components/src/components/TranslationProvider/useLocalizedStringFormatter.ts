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

// Compiling parses the message — do it once per locale and message.
const compiledMessages = new Map<string, Map<string, IntlMessageFormat>>();

const getCompiledMessage = (message: string, locale: string) => {
  let messagesOfLocale = compiledMessages.get(locale);
  if (!messagesOfLocale) {
    messagesOfLocale = new Map();
    compiledMessages.set(locale, messagesOfLocale);
  }

  let compiled = messagesOfLocale.get(message);
  if (!compiled) {
    compiled = new IntlMessageFormat(message, locale);
    messagesOfLocale.set(message, compiled);
  }

  return compiled;
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
      return String(
        getCompiledMessage(translationString, locale).format(variables),
      );
    },
    [translate, locale, componentName, dictionary],
  );

  return useMemo(() => ({ format: formatFunction }), [formatFunction]);
};
