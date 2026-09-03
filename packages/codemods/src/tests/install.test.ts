import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  detectPackageManagerIn,
  resolveInvoke,
  installCommand,
  pinnedRange,
  planInstall,
  type PackageManager,
  type Probe,
} from "../install";

const project = (
  files: Record<string, string>,
): { root: string; nested: string } => {
  const root = mkdtempSync(join(tmpdir(), "flow-codemods-install-"));
  const nested = join(root, "packages", "app");
  mkdirSync(nested, { recursive: true });

  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(root, name), content);
  }
  return { root, nested };
};

const manifest = (fields: Record<string, unknown>): string =>
  JSON.stringify({ name: "fixture", ...fields });

describe("detectPackageManagerIn", () => {
  test("recognises a lockfile in the directory itself", async () => {
    const { root } = project({ "pnpm-lock.yaml": "" });
    expect((await detectPackageManagerIn(root)).agent).toBe("pnpm");
  });

  test("recognises the binary bun lockfile", async () => {
    // `bun.lockb` predates Bun 1.2's text `bun.lock` and plenty of projects
    // still have it. Missing it used to mean `npm install` on a Bun project.
    const { root } = project({ "bun.lockb": "" });
    expect((await detectPackageManagerIn(root)).agent).toBe("bun");
  });

  test("walks up to the workspace root — the monorepo bug", async () => {
    // The regression this rewrite exists for: a workspace package has no
    // lockfile of its own, so detection in the directory alone fell through to
    // npm and ran `npm install` on a `workspace:*` manifest, which dies with
    // EUNSUPPORTEDPROTOCOL after the bump was already written.
    const { nested } = project({ "yarn.lock": "" });
    expect((await detectPackageManagerIn(nested)).agent).toBe("yarn");
  });

  test("honours a packageManager pin with no lockfile anywhere", async () => {
    const { nested } = project({
      "package.json": manifest({ packageManager: "pnpm@8.15.0" }),
    });
    const detected = await detectPackageManagerIn(nested);
    expect(detected.agent).toBe("pnpm");
    expect(detected.version).toBe("8.15.0");
  });

  test("reads yarn 4 as berry, not as classic", async () => {
    const { root } = project({
      "package.json": manifest({ packageManager: "yarn@4.6.0" }),
    });
    // The distinction decides `yarn dlx` vs `npx` for the printed commands.
    expect((await detectPackageManagerIn(root)).agent).toBe("yarn@berry");
  });

  test("honours devEngines.packageManager", async () => {
    const { root } = project({
      "package.json": manifest({
        devEngines: { packageManager: { name: "pnpm" } },
      }),
    });
    expect((await detectPackageManagerIn(root)).agent).toBe("pnpm");
  });

  test("falls back to npm when nothing says anything", async () => {
    const { root } = project({});
    expect((await detectPackageManagerIn(root)).agent).toBe("npm");
  });
});

describe("installCommand", () => {
  test("npm and bun install plainly", () => {
    expect(installCommand("npm")).toEqual({
      command: "npm",
      args: ["i"],
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
  test.each(["pnpm", "pnpm@6", "pnpm-rush"] as const)(
    "%s is told not to freeze the lockfile",
    (agent) => {
      expect(installCommand(agent).args).toContain("--no-frozen-lockfile");
    },
  );

  test.each(["yarn", "yarn@berry"] as const)(
    "%s gets the env var, because its flag differs between v1 and v2",
    (agent) => {
      expect(installCommand(agent).env).toEqual({
        YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
      });
    },
  );
});

describe("pinnedRange", () => {
  test("a full version is a range meaning exactly it", () => {
    expect(pinnedRange("8.15.0")).toBe("8.15.0");
  });

  test("a major-only pin is a range too", () => {
    expect(pinnedRange("8")).toBe("8");
  });

  test('"berry" is a specifier, not a version', () => {
    // `satisfies` would throw on it.
    expect(pinnedRange("berry")).toBeUndefined();
  });

  test("an unparseable packageManager value is not a range", () => {
    expect(pinnedRange("pnpm@not-a-version")).toBeUndefined();
  });

  test("no pin at all", () => {
    expect(pinnedRange(undefined)).toBeUndefined();
  });
});

describe("planInstall", () => {
  const pinned: PackageManager = {
    name: "pnpm",
    agent: "pnpm",
    version: "8.15.0",
  };
  const unpinned: PackageManager = { name: "pnpm", agent: "pnpm" };

  const probeReturning =
    (versions: Record<string, string | undefined>): Probe =>
    (command) =>
      versions[command];

  test("no pin runs directly and never probes", () => {
    let probed = false;
    const plan = planInstall(unpinned, () => {
      probed = true;
      return undefined;
    });
    expect(probed).toBe(false);
    expect(plan.command).toBe("pnpm");
    expect(plan.description).toBe("pnpm — pnpm i --no-frozen-lockfile");
  });

  test("a satisfied pin runs directly", () => {
    const plan = planInstall(pinned, probeReturning({ pnpm: "8.15.0" }));
    expect(plan.command).toBe("pnpm");
    expect(plan.description).toContain("8.15.0");
  });

  test("a major-only pin is satisfied by any matching patch", () => {
    // The reason this is `satisfies` and not a string compare: a string compare
    // would send this perfectly fine setup through corepack.
    const plan = planInstall(
      { name: "pnpm", agent: "pnpm", version: "8" },
      probeReturning({ pnpm: "8.15.0" }),
    );
    expect(plan.command).toBe("pnpm");
  });

  test("a mismatched pin goes through corepack", () => {
    const plan = planInstall(
      pinned,
      probeReturning({ pnpm: "10.2.0", corepack: "0.29.0" }),
    );
    expect(plan.command).toBe("corepack");
    expect(plan.args).toEqual(["pnpm", "i", "--no-frozen-lockfile"]);
    // Required, not tidy: corepack prompts before a first download, and this
    // runs unattended.
    expect(plan.env.COREPACK_ENABLE_DOWNLOAD_PROMPT).toBe("0");
  });

  test("a missing binary goes through corepack too", () => {
    const plan = planInstall(pinned, probeReturning({ corepack: "0.29.0" }));
    expect(plan.command).toBe("corepack");
  });

  test("a mismatch with no corepack throws before installing anything", () => {
    expect(() =>
      planInstall(pinned, probeReturning({ pnpm: "10.2.0" })),
    ).toThrow(/pins pnpm@8\.15\.0.*is 10\.2\.0.*corepack is not available/s);
  });

  test("the refusal names where to get the pinned manager", () => {
    expect(() => planInstall(pinned, probeReturning({}))).toThrow(
      /pnpm\.io\/installation/,
    );
  });

  test("berry is not treated as a pin to check", () => {
    let probed = false;
    const plan = planInstall(
      { name: "yarn", agent: "yarn@berry", version: "berry" },
      () => {
        probed = true;
        return undefined;
      },
    );
    expect(probed).toBe(false);
    expect(plan.command).toBe("yarn");
    expect(plan.env).toEqual({ YARN_ENABLE_IMMUTABLE_INSTALLS: "false" });
  });
});

describe("resolveInvoke", () => {
  test("pnpm gets dlx", async () => {
    const { root } = project({ "pnpm-lock.yaml": "" });
    expect(await resolveInvoke(root, "pkg@latest")).toBe("pnpm dlx pkg@latest");
  });

  test("yarn berry gets dlx, classic gets npx", async () => {
    // Yarn Classic has no `dlx`; the library resolves it to npx, and that is
    // correct rather than a fallback.
    const berry = project({
      "package.json": manifest({ packageManager: "yarn@4.6.0" }),
    });
    const classic = project({ "yarn.lock": "" });
    expect(await resolveInvoke(berry.root, "pkg@latest")).toBe(
      "yarn dlx pkg@latest",
    );
    expect(await resolveInvoke(classic.root, "pkg@latest")).toBe(
      "npx pkg@latest",
    );
  });

  test("bun gets bun x", async () => {
    const { root } = project({ "bun.lock": "" });
    expect(await resolveInvoke(root, "pkg@latest")).toBe("bun x pkg@latest");
  });

  test("npx when nothing is detected", async () => {
    const { root } = project({});
    expect(await resolveInvoke(root, "pkg@latest")).toBe("npx pkg@latest");
  });

  test("resolves from the workspace root for a nested package", async () => {
    const { nested } = project({ "pnpm-lock.yaml": "" });
    expect(await resolveInvoke(nested, "pkg@latest")).toBe(
      "pnpm dlx pkg@latest",
    );
  });
});
