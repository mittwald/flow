import { setThemeHtmlAttribute } from "./setThemeHtmlAttribute";
import type { Theme } from "../types";

export const setTheme = (theme: Theme) => {
  if (typeof window === "undefined") {
    return;
  }
  setThemeHtmlAttribute(theme);
};
