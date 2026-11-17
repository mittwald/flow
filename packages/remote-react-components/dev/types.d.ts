/// <reference types="vite/client" />
import "@vitest/browser/matchers.d.ts";
import "@vitest/browser/providers/playwright";
import { type Locator } from "vitest/browser";

declare module "vitest/browser" {
  interface LocatorSelectors {
    getByLocator(locator: string): Locator;
  }
}
