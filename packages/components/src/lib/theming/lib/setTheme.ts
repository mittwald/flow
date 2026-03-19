import { setThemeHtmlAttribute } from "./setThemeHtmlAttribute";
import type { Theme } from "../types";

export const setTheme = (theme: Theme) => {
  if (typeof window === "undefined") {
    return;
  }

  // See https://paco.me/writing/disable-theme-transitions
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      `* {
       -webkit-transition: all var(--transition--duration--slow) !important;
       -moz-transition: all var(--transition--duration--slow) !important;
       -o-transition: all var(--transition--duration--slow) !important;
       -ms-transition: all var(--transition--duration--slow) !important;
       transition: all var(--transition--duration--slow) !important;
    }`,
    ),
  );
  document.head.appendChild(css);

  setThemeHtmlAttribute(theme);

  setTimeout(() => {
    document.head.removeChild(css);
  }, 100);
};
