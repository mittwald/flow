import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext, useMemo } from "react";
import { pickBy } from "remeda";

type LocaleDictionary = Record<string, string>;

export interface Translations {
  [locale: string]: LocaleDictionary | undefined;
  "de-DE"?: LocaleDictionary;
  "en-US"?: LocaleDictionary;
}

type Props = PropsWithChildren & {
  translations: Translations;
};

const context = createContext<Translations>({});

export const useTranslationProvider = () => useContext(context);

export const TranslationProvider: FC<Props> = (props) => {
  const { children, translations } = props;

  return (
    <context.Provider
      value={useMemo(
        () => pickBy(translations, (value) => value !== undefined),
        [translations],
      )}
    >
      {children}
    </context.Provider>
  );
};

export default TranslationProvider;
