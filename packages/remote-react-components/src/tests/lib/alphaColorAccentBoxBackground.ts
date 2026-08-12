import { isDarkVisualTheme } from "@/tests/lib/visualTheme";

const darkBackdrop = "#3A434E";
const lightBackdrop = "#E5EFF8";

/**
 * Backdrop that keeps an `AlphaColor` legible in both themes.
 *
 * `dark`/`light` invert with the theme themselves (`color-palette.*.yml`), so
 * `dark` gets its contrast from the theme-adaptive `neutral` background, while
 * `light` needs the opposite of `neutral` in the current theme.
 * `dark-static`/`light-static` never invert, so they always need the fixed
 * backdrop opposite their own name.
 */
export const alphaColorAccentBoxBackground = (color: string): string => {
  if (color === "light-static") return darkBackdrop;
  if (color === "dark-static") return lightBackdrop;
  if (color === "light")
    return isDarkVisualTheme() ? lightBackdrop : darkBackdrop;
  return "neutral";
};
