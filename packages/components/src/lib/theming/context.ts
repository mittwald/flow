import { createContext, useContext } from "react";
import type { Theme } from "./types";

/** The theme of the nearest `ThemeScope`, `undefined` outside of any. */
export const ThemeScopeContext = createContext<Theme | undefined>(undefined);

export const useThemeScope = (): Theme | undefined =>
  useContext(ThemeScopeContext);
