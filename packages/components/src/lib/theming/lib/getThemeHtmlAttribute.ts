import { themeHtmlAttribute } from "./keys";
import type { Theme } from "../types";
import { sanitizeTheme } from "./sanitizeTheme";

export const getThemeHtmlAttribute = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }
  return (
    sanitizeTheme(document.documentElement.getAttribute(themeHtmlAttribute)) ??
    "system"
  );
};
