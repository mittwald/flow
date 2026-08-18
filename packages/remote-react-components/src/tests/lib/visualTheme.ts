import { server } from "vitest/browser";

/**
 * The visual suite already runs in two browsers, so the theme rides along on
 * the browser instead of doubling the run time with a second axis (see
 * `dev/vitest/setupVisualTheme.ts`).
 */
const darkThemeBrowser = "firefox";

export const isDarkVisualTheme = (): boolean =>
  server.browser === darkThemeBrowser;
