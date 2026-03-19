import type { ResolvedTheme, Theme } from "../types";
import { getSystemTheme } from "./getSystemTheme";

export const resolveTheme = (theme: Theme = "system"): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "light";
  }
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
};
