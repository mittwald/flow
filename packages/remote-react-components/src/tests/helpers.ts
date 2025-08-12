import type { Locator } from "@vitest/browser/context";
import { expect } from "vitest";

export const expectNotToBeInTheDocumentFor = (
  locator: Locator,
  forMs = 1000,
) => {
  return expect(() =>
    expect.element(locator, { timeout: forMs }).toBeInTheDocument(),
  ).rejects.toBeDefined();
};

export const expectNotVisibleFor = (locator: Locator, forMs = 1000) => {
  return expect(() =>
    expect.element(locator, { timeout: forMs }).toBeVisible(),
  ).rejects.toBeDefined();
};
