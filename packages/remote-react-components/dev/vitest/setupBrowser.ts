import { locators } from "vitest/browser";
import "@mittwald/flow-react-components/all.css";

export const setup = () => {
  process.env.LC_ALL = "de.DE";
};

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
