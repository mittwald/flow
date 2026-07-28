import { expect, test } from "vitest";
import { parsePublicComponentNames } from "./parsePublicComponentNames";

test("extracts the last path segment of every `export * from` line", () => {
  const source = [
    'export * from "@/components/Button";',
    'export * from "@/components/Calendar/components/RangeCalendar";',
    'export * from "@/components/Icon/components/icons";',
    'export * from "@/lib/react/components/Render";',
    "",
  ].join("\n");

  expect(parsePublicComponentNames(source)).toEqual(
    new Set(["Button", "RangeCalendar", "icons", "Render"]),
  );
});

test("ignores lines that are not wildcard re-exports", () => {
  const source = [
    'export * from "@/components/Button";',
    'export { Foo } from "@/components/Foo";', // named export, not `* from`
    "// a comment",
    "",
  ].join("\n");

  expect(parsePublicComponentNames(source)).toEqual(new Set(["Button"]));
});

test("returns an empty set for empty source", () => {
  expect(parsePublicComponentNames("")).toEqual(new Set());
});
