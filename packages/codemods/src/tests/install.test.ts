import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  detectPackageManager,
  detectPackageManagerIn,
  installCommand,
} from "../install";

describe("detectPackageManager", () => {
  test("recognises each lockfile", () => {
    expect(detectPackageManager(["pnpm-lock.yaml"])).toBe("pnpm");
    expect(detectPackageManager(["package-lock.json"])).toBe("npm");
    expect(detectPackageManager(["yarn.lock"])).toBe("yarn");
    expect(detectPackageManager(["bun.lock"])).toBe("bun");
  });

  test("prefers pnpm when several lockfiles are present", () => {
    expect(detectPackageManager(["package-lock.json", "pnpm-lock.yaml"])).toBe(
      "pnpm",
    );
  });

  test("falls back to npm when there is no lockfile", () => {
    expect(detectPackageManager([])).toBe("npm");
  });
});

describe("detectPackageManagerIn", () => {
  test("resolves bun from the binary lockfile on disk", () => {
    const dir = mkdtempSync(join(tmpdir(), "flow-codemods-install-"));
    writeFileSync(join(dir, "bun.lockb"), "");

    expect(detectPackageManagerIn(dir)).toBe("bun");
  });

  test("falls back to npm when the directory has no lockfile", () => {
    const dir = mkdtempSync(join(tmpdir(), "flow-codemods-install-"));

    expect(detectPackageManagerIn(dir)).toBe("npm");
  });
});

describe("installCommand", () => {
  test("npm and bun install plainly", () => {
    expect(installCommand("npm")).toEqual({
      command: "npm",
      args: ["install"],
      env: {},
    });
    expect(installCommand("bun")).toEqual({
      command: "bun",
      args: ["install"],
      env: {},
    });
  });

  // `upgrade` has just made the lockfile stale on purpose, and both of these
  // freeze the lockfile by themselves in CI, where the install would then fail.
  test("pnpm is told not to freeze the lockfile", () => {
    expect(installCommand("pnpm").args).toEqual([
      "install",
      "--no-frozen-lockfile",
    ]);
  });

  test("yarn gets the env var, because its flag differs between v1 and v2", () => {
    expect(installCommand("yarn")).toEqual({
      command: "yarn",
      args: ["install"],
      env: { YARN_ENABLE_IMMUTABLE_INSTALLS: "false" },
    });
  });
});
