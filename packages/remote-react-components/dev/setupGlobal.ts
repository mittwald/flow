import { locators } from "vitest/browser";

export const setup = () => {
  process.env.LC_ALL = "de.DE";
};

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
