import { useLocalizedStringFormatter as useLocalizedStringFormatterAria } from "react-aria";
import { useTranslationProvider } from "@/components/TranslationProvider/TranslationProvider";
import { mergeDeep } from "remeda";
import type { FlowComponentName } from "@/components/propTypes";

type AriaLocalizedStringFormatter = typeof useLocalizedStringFormatterAria<
  string,
  string
>;
type AriaLocalizedStringFormatterParams =
  Parameters<AriaLocalizedStringFormatter>;

export type LocalizedStrings = AriaLocalizedStringFormatterParams[0];

export const useLocalizedStringFormatter = (
  strings: LocalizedStrings,
  componentName?: FlowComponentName,
): ReturnType<AriaLocalizedStringFormatter> => {
  const translationContextStrings = useTranslationProvider();

  return useLocalizedStringFormatterAria(
    mergeDeep(strings, translationContextStrings as LocalizedStrings),
    componentName,
  );
};
