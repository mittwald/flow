/*
 * The base and token layer, compiled from source by vite – not from the
 * stylesheet package's build artifact. Component module rules have always come
 * from source, and loading one half of the styling from a snapshot made a token
 * added in the same branch invisible to `vitest run`: the custom property was
 * missing and CSS dropped the whole declaration, silently (#3194).
 *
 * The `flow-unlayered-styles` PostCSS plugin flattens the layers this entry
 * declares, which is exactly what the default stylesheet variant does.
 */
import "@/styles/index.scss";
import { commands, locators } from "vitest/browser";

beforeEach(async () => {
  await commands.setReducedMotion("reduce");
});

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
