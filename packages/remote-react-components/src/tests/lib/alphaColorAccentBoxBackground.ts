import { isDarkVisualTheme } from "@/tests/lib/visualTheme";

/**
 * Backdrop for demonstrating an `AlphaColor` value (dark/light/dark-static/
 * light-static) in the visual suite, chosen so the color stays legible in both
 * themes.
 *
 * `dark`/`light` invert with the app theme themselves (see
 * `color-palette.*.yml`: `black-alpha` becomes white-based in the dark theme
 * and vice versa), so `dark` already gets enough contrast from the regular
 * theme-adaptive `neutral` AccentBox background. `light` inverts the other way
 * and needs the opposite backdrop of `neutral` in the current theme.
 *
 * `dark-static`/`light-static` never invert (always literal black/white), so
 * they always need the fixed backdrop opposite their own name, in every theme.
 */
export const alphaColorAccentBoxBackground = (color: string): string => {
  if (color === "light-static") return "#3A434E";
  if (color === "dark-static") return "#E5EFF8";
  if (color === "light") return isDarkVisualTheme() ? "#E5EFF8" : "#3A434E";
  return "neutral";
};
