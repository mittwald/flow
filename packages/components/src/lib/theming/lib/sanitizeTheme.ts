import type { Theme } from "../types";

export const sanitizeTheme = (
  theme: string | null | undefined,
): Theme | undefined => {
  if (theme === "light" || theme === "dark" || theme === "system") {
    return theme;
  }
  return;
};
