import { setTheme } from "@mittwald/flow-react-components";
import { isDarkVisualTheme } from "@/tests/lib/visualTheme";

if (isDarkVisualTheme()) {
  setTheme("dark");

  // The screenshotted root container is transparent, so the page has to provide
  // the dark backdrop. No design token exists for an application background;
  // this is the value Storybook's dark mode uses (see
  // `packages/components/.storybook/preview.tsx`).
  document.body.style.backgroundColor = "#1b1f24";
}
