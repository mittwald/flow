import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const bin = fileURLToPath(new URL("../../dist/cli.js", import.meta.url));

const run = (args: string[]): string =>
  execFileSync(process.execPath, [bin, ...args], {
    encoding: "utf8",
    stdio: "pipe",
  });

describe("the built binary", () => {
  test("prints usage without arguments", () => {
    expect(run([])).toContain("flow-codemods upgrade [revision]");
  });

  test("prints its version", () => {
    expect(run(["--version"]).trim()).toMatch(/^\d+\.\d+\.\d+/);
  });
});
