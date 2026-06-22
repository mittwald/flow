import "../../../stylesheet/dist/styles.css";
import { commands, locators } from "vitest/browser";

beforeEach(async () => {
  await commands.setReducedMotion("reduce");
});

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
