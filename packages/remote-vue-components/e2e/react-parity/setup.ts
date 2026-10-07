import { afterEach, vi } from "vitest";
import { locators } from "vitest/browser";
import "@mittwald/flow-react-components/all.css";

/*
 * What the React package's `setupBrowser.ts` does for its suites, and for the
 * same reason: the harness runs with `isolate: false`, so a clock a reused test
 * sets with `vi.setSystemTime` (the date pickers do) stays frozen for every
 * later file. A frozen `Date.now()` stops `use-debounce`, and PasswordCreationField
 * then never rates a password — the reference pass failed on it.
 */
afterEach(() => {
  vi.useRealTimers();
});

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
