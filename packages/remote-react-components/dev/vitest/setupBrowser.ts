import { commands, locators } from "vitest/browser";
import "@mittwald/flow-react-components/all.css";

/*
 * Before anything renders text: `fonts.scss` fetches the fonts from
 * cdn.mittwald.de, and a request that hangs there takes down every screenshot on
 * the page. See dev/vitest/serveFontsLocally.ts.
 */
beforeAll(async () => {
  await commands.serveFontsLocally();
});

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
