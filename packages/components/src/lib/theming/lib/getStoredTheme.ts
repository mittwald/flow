import type { Theme } from "../types";
import { getThemeHtmlAttribute } from "./getThemeHtmlAttribute";

export const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }
  return getThemeHtmlAttribute() ?? "system";
};
