import { locators } from "vitest/browser";
import "@mittwald/flow-react-components/all.css";

/*
 * The reused tests query with `page.getByLocator("input")` — a custom locator
 * the React package registers in its own browser setup. The corpus is used
 * unmodified, so the harness has to provide what it expects.
 */
locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
  /*
   * `locators.extend` is typed to vitest's built-in selectors, so a custom one
   * has no place in the signature. The React package adds the same locator the
   * same way; only this harness typechecks its setup, which is where the cast
   * comes from.
   */
} as Parameters<typeof locators.extend>[0]);
