import { parseTsgoOutput } from "./tsgoCheckerPlugin";
import { describe, expect, it } from "vitest";

describe("parseTsgoOutput", () => {
  it("parses standard tsgo diagnostics and resolves paths against root", () => {
    const output = [
      "src/components/AccentBox/AccentBox.tsx(12,5): error TS2322: Type 'string' is not assignable to type 'number'.",
      "src/lib/foo.ts(3,10): error TS2551: Property 'toFixed' does not exist on type 'string'. Did you mean 'fixed'?",
    ].join("\n");

    const result = parseTsgoOutput(output, "/repo/packages/components");

    expect(result).toEqual([
      {
        file: "/repo/packages/components/src/components/AccentBox/AccentBox.tsx",
        line: 12,
        column: 5,
        code: "TS2322",
        message: "Type 'string' is not assignable to type 'number'.",
      },
      {
        file: "/repo/packages/components/src/lib/foo.ts",
        line: 3,
        column: 10,
        code: "TS2551",
        message:
          "Property 'toFixed' does not exist on type 'string'. Did you mean 'fixed'?",
      },
    ]);
  });

  it("ignores summary lines, blank lines and unrelated noise", () => {
    const output = [
      "",
      "undefined",
      "Found 1 error.",
      "src/x.ts(1,1): error TS1005: ';' expected.",
      "Watching for file changes.",
    ].join("\n");

    const result = parseTsgoOutput(output, "/repo");

    expect(result).toHaveLength(1);
    expect(result[0]?.code).toBe("TS1005");
  });

  it("returns an empty array when there are no errors", () => {
    expect(parseTsgoOutput("", "/repo")).toEqual([]);
    expect(parseTsgoOutput("\n\n", "/repo")).toEqual([]);
  });
});
