import { themeHtmlAttribute } from "./keys";
import type { Theme } from "../types";
import { isClientSide } from "./isClientSide";

export const setThemeHtmlAttribute = (theme: Theme) => {
  if (isClientSide()) {
    document.documentElement.setAttribute(themeHtmlAttribute, theme);
  }
};
