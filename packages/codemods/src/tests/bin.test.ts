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

  // Regression for the bug this CLI used to hit on the first two things
  // anyone types for `list`: an incomplete version or a range reached
  // node-semver's own `lt`/`lte` inside `selectEntries` and surfaced a bare
  // "Invalid Version: …" with exit 1.
  test("list --from with an incomplete version fails cleanly, not with a raw semver error", () => {
    let failure: { status: number | null; stdout: string } | undefined;
    try {
      run(["list", "--from", "1.0"]);
    } catch (error) {
      failure = error as { status: number | null; stdout: string };
    }

    expect(failure?.status).toBe(1);
    expect(failure?.stdout).toContain('"1.0"');
    expect(failure?.stdout).not.toMatch(/invalid version/i);
  });

  test("list --from with a range fails cleanly", () => {
    let failure: { status: number | null; stdout: string } | undefined;
    try {
      run(["list", "--from", "^1.0.0"]);
    } catch (error) {
      failure = error as { status: number | null; stdout: string };
    }

    expect(failure?.status).toBe(1);
    expect(failure?.stdout).not.toMatch(/invalid version/i);
  });
});
