import type { Theme } from "../types";
import { getFallbackTheme } from "./getFallbackTheme";
import { getThemeHtmlAttribute } from "./getThemeHtmlAttribute";

export const getTheme = (): Theme => {
  return getThemeHtmlAttribute() ?? getFallbackTheme();
};
