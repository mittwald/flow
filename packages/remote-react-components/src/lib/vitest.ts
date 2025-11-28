import type { Locator } from "vitest/browser";

declare module "vitest/browser" {
  interface LocatorSelectors {
    getByLocator(locator: string): Locator;
  }
}
