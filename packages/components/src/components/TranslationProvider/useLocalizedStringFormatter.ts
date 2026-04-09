import { useLocalizedStringFormatter as useLocalizedStringFormatterAria } from "react-aria";
import {
  type Translations,
  useTranslationProvider,
} from "@/components/TranslationProvider/TranslationProvider";
import { mergeDeep } from "remeda";
import type { FlowComponentName } from "@/components/propTypes";
import { mapValues, pick } from "remeda";
import { useLocale } from "react-aria-components";
import type {
  Variables,
  LocalizedStrings as LocalizedStringsIntl,
} from "@internationalized/string";

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
  const { translations, translate } = useTranslationProvider();
  const locale = useLocale();
  const translateDefault = () =>
    useLocalizedStringFormatterAria(strings, componentName);

  if (translations) {
    return useLocalizedStringFormatterAria(
      mergeDeep(
        strings,
        pickComponentTranslations(componentName, translations),
      ),
      componentName,
    );
  }

  if (translate) {
    return {
      format: (key: string, variables?: Variables): string => {
        const customTranslated = translate(key, variables, {
          component: componentName,
          locale: locale.locale,
        });

        if (customTranslated === undefined) {
          return translateDefault().format(key, variables);
        }

        return customTranslated;
      },
    };
  }

  return translateDefault();
};
