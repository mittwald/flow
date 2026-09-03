import { setThemeHtmlAttribute } from "./setThemeHtmlAttribute";
import type { Theme } from "../types";

export const setTheme = (theme: Theme) => {
  setThemeHtmlAttribute(theme);
};
