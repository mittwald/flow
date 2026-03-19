import { themeHtmlAttribute } from "./keys";
import type { Theme } from "../types";

export const setThemeHtmlAttribute = (theme: Theme) => {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute(themeHtmlAttribute, theme);
  }
};
