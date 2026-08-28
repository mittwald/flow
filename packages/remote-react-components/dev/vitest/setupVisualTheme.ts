import { setTheme } from "@mittwald/flow-react-components";
import { isDarkVisualTheme } from "@/tests/lib/visualTheme";

/*
 * Both branches set the theme explicitly. Without the `light` one the token CSS
 * falls through to its `:root:not([data-theme])` branch, which follows
 * `prefers-color-scheme` — so the light baselines would render light only for
 * as long as playwright keeps emulating a light system, and a run in a browser
 * it does not drive would flip them.
 */
if (isDarkVisualTheme()) {
  setTheme("dark");

  // The screenshotted root container is transparent, so the page has to provide
  // the dark backdrop. No design token exists for an application background;
  // this is the value Storybook's dark mode uses (see
  // `packages/components/.storybook/preview.tsx`).
  document.body.style.backgroundColor = "#1b1f24";
} else {
  setTheme("light");
}
