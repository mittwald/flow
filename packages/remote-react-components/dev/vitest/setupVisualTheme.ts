import { setTheme } from "@mittwald/flow-react-components";
import { isDarkVisualTheme } from "@/tests/lib/visualTheme";

if (isDarkVisualTheme()) {
  setTheme("dark");

  /**
   * Screenshots are taken of the root container, which is transparent — so the
   * page behind it has to provide the dark backdrop. There is no design token
   * for an application background; this is the same value Storybook's dark mode
   * uses (see `packages/components/.storybook/preview.tsx`).
   */
  document.body.style.backgroundColor = "#1b1f24";
}
