import { describe, expect, test } from "vitest";
import { detectPackageManager, installCommand } from "../install.js";

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

describe("installCommand", () => {
  test("each manager gets its own install verb", () => {
    expect(installCommand("pnpm")).toEqual(["pnpm", ["install"]]);
    expect(installCommand("npm")).toEqual(["npm", ["install"]]);
    expect(installCommand("yarn")).toEqual(["yarn", ["install"]]);
    expect(installCommand("bun")).toEqual(["bun", ["install"]]);
  });
});
