import "../../../stylesheet/dist/styles.css";
import { locators } from "vitest/browser";

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
