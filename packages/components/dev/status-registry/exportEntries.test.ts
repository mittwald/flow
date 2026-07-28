import { expect, test } from "vitest";
import { STATUS_EXPORT_ENTRIES, specifierOf } from "./exportEntries";

const PKG = "@mittwald/flow-react-components";

test.each([
  [".", `${PKG}`],
  ["./nextjs", `${PKG}/nextjs`],
  ["./flr-universal", `${PKG}/flr-universal`],
  ["./password-tools", `${PKG}/password-tools`],
] as const)("specifierOf(%s) === %s", (key, expected) => {
  expect(specifierOf(key, PKG)).toBe(expected);
});

test("STATUS_EXPORT_ENTRIES covers the five component-bearing entries only", () => {
  expect(STATUS_EXPORT_ENTRIES.map((e) => e.key)).toEqual([
    ".",
    "./flr-universal",
    "./nextjs",
    "./react-hook-form",
    "./password-tools",
  ]);
});
