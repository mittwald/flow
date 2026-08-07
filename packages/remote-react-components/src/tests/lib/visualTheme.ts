import { server } from "vitest/browser";

/**
 * The visual suite runs every test in two browsers. Instead of doubling the
 * (already long) run time with a second theme axis, one browser renders all
 * screenshots in the dark theme, the other one in the light theme — so a single
 * run covers both themes (see `dev/vitest/setupVisualTheme.ts`).
 */
const darkThemeBrowser = "firefox";

export const isDarkVisualTheme = (): boolean =>
  server.browser === darkThemeBrowser;
