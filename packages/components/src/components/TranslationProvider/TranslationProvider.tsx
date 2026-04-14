import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";
import type {
  LocalizedComponentName,
  TranslationFunction,
} from "@/components/TranslationProvider/useLocalizedStringFormatter";

type ComponentTranslationDictionary = Record<
  LocalizedComponentName,
  Record<string, string>
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

export type TranslationProviderProps = PropsWithChildren & TranslationContext;

const context = createContext<TranslationContext>({});

export const useTranslationProvider = () => useContext(context);

/** @flr-generate all */
export const TranslationProvider: FC<TranslationProviderProps> = (props) => {
  const { children, translations, translate } = props;

  return (
    <context.Provider value={{ translations, translate }}>
      {children}
    </context.Provider>
  );
};

export default TranslationProvider;
