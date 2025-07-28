import { useLocalizedStringFormatter } from "react-aria";
import { useTranslationProvider } from "@/components/TranslationProvider/TranslationProvider";
import { mergeDeep } from "remeda";
import type { FlowComponentName } from "@/components/propTypes";

type AriaLocalizedStringFormatter = typeof useLocalizedStringFormatter<
  string,
  string
>;
type AriaLocalizedStringFormatterParams =
  Parameters<AriaLocalizedStringFormatter>;

export const useLocalizedContextStringFormatter = (
  strings: AriaLocalizedStringFormatterParams[0],
  componentName?: FlowComponentName,
): ReturnType<AriaLocalizedStringFormatter> => {
  const translationContextStrings = useTranslationProvider();

  return useLocalizedStringFormatter(
    mergeDeep(strings, translationContextStrings),
    componentName,
  );
};
