import { describe, expect, test } from "vitest";
import {
  findUniversalExportOverlap,
  readUniversalExportNames,
} from "./checkUniversalExportOverlap";

describe("readUniversalExportNames", () => {
  test("reads the explicitly exported value names", () => {
    expect(
      readUniversalExportNames(`
        export { Action, LightBox, List } from "@/components/public";
      `),
    ).toEqual(["Action", "LightBox", "List"]);
  });

  test("ignores type exports, which cannot collide at runtime", () => {
    expect(
      readUniversalExportNames(`
        export { Action, type ActionProps } from "@/components/public";
        export type { ListProps } from "@/components/List";
      `),
    ).toEqual(["Action"]);
  });

  test("reads the exported name, not the local one", () => {
    expect(
      readUniversalExportNames(`
        export { InternalList as List } from "@/components/public";
      `),
    ).toEqual(["List"]);
  });

  test("skips star re-exports, which it cannot resolve", () => {
    expect(
      readUniversalExportNames(`
        export * from "@/lib/controller/public";
        export { Action } from "@/components/public";
      `),
    ).toEqual(["Action"]);
  });
});

describe("findUniversalExportOverlap", () => {
  test("is empty while the two surfaces stay disjoint", () => {
    expect(findUniversalExportOverlap(["Button", "Modal"], ["Action"])).toEqual(
      [],
    );
  });

  test("names a component both surfaces provide", () => {
    expect(
      findUniversalExportOverlap(["Button", "List"], ["Action", "List"]),
    ).toEqual(["List"]);
  });

  test("reports each name once, sorted", () => {
    expect(
      findUniversalExportOverlap(
        ["List", "Action", "List"],
        ["Action", "List"],
      ),
    ).toEqual(["Action", "List"]);
  });
});
