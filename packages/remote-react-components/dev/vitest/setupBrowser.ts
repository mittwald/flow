import { locators } from "vitest/browser";
import "@mittwald/flow-react-components/all.css";

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
