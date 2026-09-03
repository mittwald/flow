import type { Theme } from "@mittwald/flow-react-components";

export const themeStorageKey = "@mittwald/flow-docs/theme";

export const storeTheme = (theme: Theme) => {
  localStorage.setItem(themeStorageKey, theme);
};

export const loadTheme = (): Theme | null => {
  return localStorage.getItem(themeStorageKey) as Theme | null;
};
