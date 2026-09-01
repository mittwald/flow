import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const bin = fileURLToPath(new URL("../../dist/cli.js", import.meta.url));

const run = (args: string[], cwd?: string): string =>
  execFileSync(process.execPath, [bin, ...args], {
    encoding: "utf8",
    stdio: "pipe",
    cwd,
  });

describe("the built binary", () => {
  test("prints usage without arguments", () => {
    expect(run([])).toContain("flow-codemods upgrade [revision]");
  });

  test("prints its version", () => {
    expect(run(["--version"]).trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  // Regression for the bug this CLI used to hit on the first thing anyone
  // types for `list --from`, back when that flag existed: an incomplete
  // version or a range reached node-semver's own `lt`/`lte` inside
  // `selectEntries` and surfaced a bare "Invalid Version: …" with exit 1.
  // `--from`/`--to` are gone now (a revision replaced them), so the flag
  // itself is what's invalid — `parseArgs`'s own "unknown option" is exactly
  // that clean failure, not a raw semver error.
  test("the removed --from flag is rejected, not silently accepted", () => {
    let failure: { status: number | null; stderr: string } | undefined;
    try {
      run(["list", "--from", "1.0"]);
    } catch (error) {
      failure = error as { status: number | null; stderr: string };
    }

    expect(failure?.status).toBe(1);
    expect(failure?.stderr).not.toMatch(/invalid version/i);
  });

  // `list <revision>`, unlike a bare `list`, needs a package.json to read the
  // current Flow version from. Regression target: this used to be a raw
  // `ENOENT: no such file or directory, open '.../package.json'`.
  test("list <revision> with no package.json fails cleanly, not with a raw ENOENT", () => {
    const cwd = mkdtempSync(join(tmpdir(), "flow-codemods-bin-nomanifest-"));

    let failure: { status: number | null; stdout: string } | undefined;
    try {
      run(["list", "minor"], cwd);
    } catch (error) {
      failure = error as { status: number | null; stdout: string };
    }

    expect(failure?.status).toBe(1);
    expect(failure?.stdout).not.toContain("ENOENT");
    expect(failure?.stdout).toContain("No package.json found");
  });

  // A bare `list` needs neither a manifest nor the network — it must still
  // work from a directory with nothing in it at all.
  test("a bare list works offline, even with no package.json", () => {
    const cwd = mkdtempSync(join(tmpdir(), "flow-codemods-bin-offline-"));

    expect(run(["list"], cwd)).toContain("migrations");
  });
});
