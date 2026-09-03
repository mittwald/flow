import type { Theme } from "../types";
import { getFallbackTheme } from "./getFallbackTheme";

export const sanitizeTheme = (theme: string | null | undefined): Theme => {
  if (theme === "light" || theme === "dark" || theme === "system") {
    return theme;
  }
  return getFallbackTheme();
};
