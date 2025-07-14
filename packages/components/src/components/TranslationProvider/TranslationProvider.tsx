import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext, useMemo } from "react";

export interface TranslationContext {
  "de-DE"?: Record<string, string>;
  "en-US"?: Record<string, string>;
}

type Props = PropsWithChildren & {
  translations: TranslationContext;
};

const context = createContext<TranslationContext>({});

export const useTranslationProvider = () => useContext(context);

export const TranslationProvider: FC<Props> = (props) => {
  const { children, translations } = props;

  return (
    <context.Provider value={useMemo(() => translations, [translations])}>
      {children}
    </context.Provider>
  );
};

export default TranslationProvider;
