import type { ResolvedTheme, Theme } from "../types";
import { ColorSchemeMediaQuery } from "./ColorSchemeMediaQuery";

export const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === "system") {
    return ColorSchemeMediaQuery.getPreference().preferred;
  }
  return theme;
};
