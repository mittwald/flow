import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";
import {
  collectBrandColorGroups,
  findBrandColorVariables,
} from "./brandColorVariables.mjs";

const groups = new Set(["mittwald-blue", "black-alpha"]);

const names = (text: string, openEnd = false) =>
  findBrandColorVariables(text, { groups, openEnd }).map((found) => [
    found.name,
    found.completedAtRuntime,
  ]);

describe("collectBrandColorGroups", () => {
  test("reads the groups from the Brand token file", () => {
    const known = collectBrandColorGroups();

    expect(known).toContain("mittwald-blue");
    expect(known).toContain("black-alpha");
    // Semantic roles live outside `color`, so they are never Brand.
    expect(known).not.toContain("primary");
  });

  test("covers a group added to the file", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "brand-colors-"));
    const file = path.join(dir, "color-brand.yml");
    fs.writeFileSync(
      file,
      'color:\n  new-hue:\n    100:\n      value: "#ffffff"\n',
    );

    expect(collectBrandColorGroups(file)).toEqual(new Set(["new-hue"]));
  });
});

describe("findBrandColorVariables", () => {
  test("finds a Brand variable", () => {
    expect(names("var(--color--mittwald-blue--100)")).toEqual([
      ["--color--mittwald-blue--100", false],
    ]);
  });

  test("ignores Semantic, Variant and component variables", () => {
    expect(
      names(
        "var(--primary--color--100) var(--primary-solid-background-color) var(--label--color--default)",
      ),
    ).toEqual([]);
  });

  test("ignores a name that is not a Brand group", () => {
    expect(names("var(--color--mittwald-blue-light--100)")).toEqual([]);
  });

  test("finds a step completed by SCSS interpolation", () => {
    expect(names("var(--color--mittwald-blue--#{$step})")).toEqual([
      ["--color--mittwald-blue--", false],
    ]);
  });

  test("finds a group completed by SCSS interpolation", () => {
    expect(names("var(--color--#{$hue}--100)")).toEqual([["--color--", true]]);
    expect(names("var(--color--mittwald-#{$hue}--100)")).toEqual([
      ["--color--mittwald-", true],
    ]);
  });

  test("ignores an interpolated name no Brand group starts with", () => {
    expect(names("var(--color--accent-#{$hue})")).toEqual([]);
  });

  test("finds a group completed by a template literal", () => {
    expect(names("var(--color--", true)).toEqual([["--color--", true]]);
  });
});
