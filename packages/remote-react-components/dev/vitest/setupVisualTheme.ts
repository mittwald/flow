import { server } from "vitest/browser";
import { setTheme } from "@mittwald/flow-react-components";

/**
 * The visual suite runs every test in two browsers. Instead of doubling the
 * (already long) run time with a second theme axis, one browser renders all
 * screenshots in the dark theme, the other one in the light theme — so a single
 * run covers both themes.
 *
 * Consequence: the `*-firefox-*.png` baselines are dark by design, the
 * `*-webkit-*.png` baselines are light. Filtering the run to a single browser
 * (`--browser.name=webkit`) therefore only verifies one of the two themes.
 */
const darkThemeBrowser = "firefox";

if (server.browser === darkThemeBrowser) {
  setTheme("dark");

  /**
   * Screenshots are taken of the root container, which is transparent — so the
   * page behind it has to provide the dark backdrop. There is no design token
   * for an application background; this is the same value Storybook's dark mode
   * uses (see `packages/components/.storybook/preview.tsx`).
   */
  document.body.style.backgroundColor = "#1b1f24";
}
