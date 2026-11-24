import { isDarkVisualTheme } from "@/tests/lib/visualTheme";

/** The AccentBox's own `neutral`: light in light, dark in dark. */
const neutralBackdrop = "neutral";
/** The strong neutral surface: dark in light, light in dark. */
const strongBackdrop = "var(--neutral--color--strong--100)";

/**
 * Backdrop that keeps an `AlphaColor` legible in both themes. Each theme shows
 * two backdrops: the `neutral` AccentBox and the strong neutral surface.
 *
 * `dark`/`light` invert with the theme themselves (`color-semantic.*.yml`), so
 * `dark` gets its contrast from `neutral`, while `light` needs the strong
 * surface, the opposite of `neutral` in the current theme.
 * `dark-static`/`light-static` never invert, so they take whichever backdrop is
 * opposite their own name in the current theme.
 */
export const alphaColorAccentBoxBackground = (color: string): string => {
  const isDark = isDarkVisualTheme();
  if (color === "light-static")
    return isDark ? neutralBackdrop : strongBackdrop;
  if (color === "dark-static") return isDark ? strongBackdrop : neutralBackdrop;
  if (color === "light") return strongBackdrop;
  return neutralBackdrop;
};
