import type { ResolvedTheme } from "../types";
import { useThemeScope } from "../context";
import { useSystemTheme } from "./useSystemTheme";
import { useTheme } from "./useTheme";

/** The theme in effect here: the nearest `ThemeScope`'s, else the document's. */
export const useResolvedTheme = (): ResolvedTheme => {
  const documentTheme = useTheme();
  const scopeTheme = useThemeScope();
  const systemTheme = useSystemTheme();
  const theme = scopeTheme ?? documentTheme;
  return theme === "system" ? systemTheme : theme;
};
