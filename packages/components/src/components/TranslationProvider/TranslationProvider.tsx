import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";
import type {
  LocalizedComponentName,
  TranslationFunction,
} from "@/components/TranslationProvider/useLocalizedStringFormatter";
import type { Variables } from "@internationalized/string";

type ComponentTranslationDictionary = Record<
  LocalizedComponentName,
  Record<string, string | ((variables: Variables) => string)>
>;

export interface Translations {
  [locale: string]: ComponentTranslationDictionary | undefined;
  "de-DE"?: ComponentTranslationDictionary;
  "en-US"?: ComponentTranslationDictionary;
}

export interface TranslationContext {
  translations?: Translations;
  translate?: TranslationFunction;
}

type Props = PropsWithChildren & TranslationContext;

const context = createContext<TranslationContext>({});

export const useTranslationProvider = () => useContext(context);

export const TranslationProvider: FC<Props> = (props) => {
  const { children, translations, translate } = props;

  return (
    <context.Provider value={{ translations, translate }}>
      {children}
    </context.Provider>
  );
};

export default TranslationProvider;
