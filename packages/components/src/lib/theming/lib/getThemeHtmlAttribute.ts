import { themeHtmlAttribute } from "./keys";
import { sanitizeTheme } from "./sanitizeTheme";
import { isClientSide } from "./isClientSide";

export const getThemeHtmlAttribute = () => {
  if (isClientSide()) {
    return sanitizeTheme(
      document.documentElement.getAttribute(themeHtmlAttribute),
    );
  }
};
