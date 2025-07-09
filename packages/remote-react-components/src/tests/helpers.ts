import type { Locator } from "@vitest/browser/context";
import { expect, type ExpectPollOptions } from "vitest";

export const expectNeverBeInTheDocument = (
  locator: Locator,
  opts: ExpectPollOptions = {},
) => {
  const { timeout = 1000 } = opts;
  return expect(() =>
    expect.element(locator, { ...opts, timeout }).toBeInTheDocument(),
  ).rejects.toBeDefined();
};
