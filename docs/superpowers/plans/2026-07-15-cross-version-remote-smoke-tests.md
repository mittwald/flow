# Cross-version remote smoke tests — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render a curated ~10-test subset of the existing visual tests using previously-published remote versions, wired to the current host, and screenshot-compare against the current shared baselines — catching backwards-compatibility regressions in the scheduled visual workflow.

**Architecture:** A pure version resolver picks old versions (semver categories with an alpha-offset fallback, minus an exclude list). A prepare script resolves + installs those versions into an isolated directory and writes a manifest. A standalone Vitest config (mirroring the e2e suite) runs the curated subset, injecting one test environment per resolved version via a virtual `environments` module that pairs each old `RemoteRoot` + old remote components with the current host `RemoteRenderer`/`RemoteReceiver`. Runs scheduled-only.

**Tech Stack:** TypeScript, Vitest 4 (browser mode, Playwright/webkit+firefox), Vite 7, `semver`, nx, pnpm, GitHub Actions.

## Global Constraints

- Package: `@mittwald/flow-remote-react-components` (`packages/remote-react-components`). All new files live under its `dev/cross-version/` (tooling; runs in the `unit-dev` node project) except the standalone Vitest config and the exclude/manifest JSON.
- Node `>=20.19`; pnpm via corepack. Single-package commands: `corepack pnpm --filter @mittwald/flow-remote-react-components <script>`. Dependency-graph targets: **bare** `pnpm nx <target> <project>`.
- New deps observe pnpm `minimumReleaseAge` of 1 week (`semver@^7` is years old — fine).
- **Never hand-edit generated files.** The manifest (`cross-version.manifest.json`) and installed `node_modules/.cross-version/**` are generated artifacts — git-ignored, not committed.
- Screenshot baselines key on the **description string** passed to `testScreenshot(...)`, not the test title. Cross-version envs reuse the *same* description → compare against the *same* existing `<Name>-<browser>-<os>.png` baseline. Never commit `*--<env>--*.png` diff artifacts.
- Cross-version tests are **scheduled-only** — not added to `affected:test:browser`.
- Commits: Conventional Commits, scope `remote-react-components`. English.

---

## File Structure

- `packages/remote-react-components/dev/cross-version/resolveCrossVersionTargets.ts` — pure resolver (Task 1).
- `packages/remote-react-components/dev/cross-version/resolveCrossVersionTargets.test.ts` — resolver unit tests (Task 1).
- `packages/remote-react-components/cross-version.exclude.json` — checked-in exclude list (Task 2).
- `packages/remote-react-components/dev/cross-version/prepare.ts` — resolve + install + write manifest (Task 3).
- `packages/remote-react-components/cross-version.manifest.json` — generated, git-ignored (Task 3).
- `packages/remote-react-components/dev/cross-version/crossVersionEnvironmentsPlugin.ts` — Vite virtual-module plugin generating the env module from the manifest (Task 5).
- `packages/remote-react-components/dev/cross-version/vitest.config.ts` — standalone cross-version Vitest config (Tasks 4 + 5).
- `packages/remote-react-components/dev/cross-version/subset.ts` — curated include-list of ~10 test files (Task 6).
- Modified: `package.json` (scripts + `semver` dep), `project.json`, `../../nx.json`, `.gitignore`, `.github/workflows/test-visual-scheduled.yml`, `CONTRIBUTE.md`.

---

## Task 1: Version resolver (pure lib)

**Files:**
- Create: `packages/remote-react-components/dev/cross-version/resolveCrossVersionTargets.ts`
- Test: `packages/remote-react-components/dev/cross-version/resolveCrossVersionTargets.test.ts`
- Modify: `packages/remote-react-components/package.json` (add `"semver": "^7.6.3"` and `"@types/semver": "^7.5.8"` to `devDependencies`)

**Interfaces:**
- Produces:
  - `interface ResolvedTarget { category: string; version: string }`
  - `interface ResolveOptions { offsets?: number[] }`
  - `function resolveCrossVersionTargets(currentVersion: string, publishedVersions: string[], excludedVersions?: string[], options?: ResolveOptions): ResolvedTarget[]`

- [ ] **Step 1: Add `semver` dependency**

Edit `packages/remote-react-components/package.json`, add to `devDependencies` (keep alphabetical):

```jsonc
"@types/semver": "^7.5.8",
"semver": "^7.6.3",
```

Then install:

Run: `corepack pnpm install`
Expected: lockfile updates, `semver` resolves (it is > 1 week old).

- [ ] **Step 2: Write the failing test**

Create `resolveCrossVersionTargets.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveCrossVersionTargets } from "./resolveCrossVersionTargets";

// A stable released history spanning two minor lines.
const released = [
  "0.1.0",
  "0.1.1",
  "0.1.2",
  "0.2.0",
  "0.2.1",
  "0.2.2",
];

describe("resolveCrossVersionTargets — semver categories", () => {
  it("resolves previous, firstOfLine and latestOfPreviousLine for a released version", () => {
    const result = resolveCrossVersionTargets("0.2.2", released);
    const byCategory = Object.fromEntries(
      result.map((r) => [r.category, r.version]),
    );
    expect(byCategory.previous).toBe("0.2.1");
    expect(byCategory.firstOfLine).toBe("0.2.0");
    expect(byCategory.latestOfPreviousLine).toBe("0.1.2");
  });

  it("ignores versions at or above the current version", () => {
    const result = resolveCrossVersionTargets("0.2.0", released);
    for (const target of result) {
      expect(target.version.startsWith("0.2.")).not.toBe(true);
    }
    // previous of 0.2.0 is the newest below it
    expect(result.find((r) => r.category === "previous")?.version).toBe("0.1.2");
  });

  it("drops categories that cannot resolve (no previous line) without throwing", () => {
    const result = resolveCrossVersionTargets("0.1.2", released);
    expect(result.find((r) => r.category === "latestOfPreviousLine")).toBeUndefined();
    expect(result.find((r) => r.category === "previous")?.version).toBe("0.1.1");
  });

  it("de-duplicates versions shared by multiple categories", () => {
    const result = resolveCrossVersionTargets("0.2.1", released);
    const versions = result.map((r) => r.version);
    expect(new Set(versions).size).toBe(versions.length);
  });
});

describe("resolveCrossVersionTargets — exclusions", () => {
  it("skips an excluded version and steps to the next valid candidate", () => {
    const result = resolveCrossVersionTargets("0.2.2", released, ["0.2.1"]);
    // previous should now skip the broken 0.2.1 and pick 0.2.0
    expect(result.find((r) => r.category === "previous")?.version).toBe("0.2.0");
    expect(result.some((r) => r.version === "0.2.1")).toBe(false);
  });
});

describe("resolveCrossVersionTargets — alpha-offset fallback", () => {
  const alpha = Array.from(
    { length: 250 },
    (_, i) => `0.2.0-alpha.${i + 1}`,
  );

  it("falls back to computed offsets when categories collapse on a prerelease line", () => {
    const current = "0.2.0-alpha.250";
    const result = resolveCrossVersionTargets(current, alpha, [], {
      offsets: [10, 100, 200],
    });
    const versions = result.map((r) => r.version);
    expect(versions).toContain("0.2.0-alpha.240"); // 250 - 10
    expect(versions).toContain("0.2.0-alpha.150"); // 250 - 100
    expect(versions).toContain("0.2.0-alpha.50"); //  250 - 200
  });

  it("drops offsets that fall before the earliest published version", () => {
    const current = "0.2.0-alpha.250";
    const short = alpha.slice(-30); // only 30 published
    const result = resolveCrossVersionTargets(current, short, [], {
      offsets: [10, 100, 200],
    });
    const versions = result.map((r) => r.version);
    expect(versions).toContain("0.2.0-alpha.240"); // -10 exists
    expect(versions.some((v) => v === "0.2.0-alpha.150")).toBe(false); // -100 gone
  });

  it("honours exclusions in offset mode by stepping to the next older version", () => {
    const current = "0.2.0-alpha.250";
    const result = resolveCrossVersionTargets(current, alpha, ["0.2.0-alpha.240"], {
      offsets: [10],
    });
    // -10 would be alpha.240 (excluded) → step to alpha.239
    expect(result.some((r) => r.version === "0.2.0-alpha.240")).toBe(false);
    expect(result.some((r) => r.version === "0.2.0-alpha.239")).toBe(true);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `corepack pnpm --filter @mittwald/flow-remote-react-components exec vitest run --project=unit-dev dev/cross-version/resolveCrossVersionTargets.test.ts`
Expected: FAIL — `resolveCrossVersionTargets` is not defined / module not found.

- [ ] **Step 4: Write the implementation**

Create `resolveCrossVersionTargets.ts`:

```ts
import semver from "semver";

export interface ResolvedTarget {
  category: string;
  version: string;
}

export interface ResolveOptions {
  /** Index offsets (versions back) used in the prerelease fallback. */
  offsets?: number[];
}

const DEFAULT_OFFSETS = [10, 100, 200];

/** major.minor.patch of a version, ignoring the prerelease tag. */
const lineOf = (version: string): string => {
  const parsed = semver.parse(version);
  if (!parsed) {
    return version;
  }
  return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
};

/**
 * Resolves the set of previously-published versions to run cross-version smoke
 * tests against. Pure: no I/O. The caller supplies the published version list
 * (from npm) and the exclude list.
 */
export function resolveCrossVersionTargets(
  currentVersion: string,
  publishedVersions: string[],
  excludedVersions: string[] = [],
  options: ResolveOptions = {},
): ResolvedTarget[] {
  const excluded = new Set(excludedVersions);

  // Valid, non-excluded, strictly-older versions, ascending.
  const candidates = publishedVersions
    .filter((v) => semver.valid(v) !== null)
    .filter((v) => !excluded.has(v))
    .filter((v) => semver.lt(v, currentVersion))
    .sort(semver.compare);

  if (candidates.length === 0) {
    return [];
  }

  const push = (
    targets: ResolvedTarget[],
    category: string,
    version: string | undefined,
  ): void => {
    if (version && !targets.some((t) => t.version === version)) {
      targets.push({ category, version });
    }
  };

  // --- semver categories ---
  const semverTargets: ResolvedTarget[] = [];
  const currentLine = lineOf(currentVersion);

  // previous: nearest below current
  push(semverTargets, "previous", candidates[candidates.length - 1]);

  // firstOfLine: earliest candidate on the current line
  const currentLineVersions = candidates.filter((v) => lineOf(v) === currentLine);
  push(semverTargets, "firstOfLine", currentLineVersions[0]);

  // latestOfPreviousLine: latest candidate on the highest line strictly below currentLine
  const previousLine = candidates
    .map(lineOf)
    .filter((line) => semver.lt(`${line}`, `${currentLine}`))
    .sort(semver.compare)
    .pop();
  if (previousLine) {
    const previousLineVersions = candidates.filter((v) => lineOf(v) === previousLine);
    push(
      semverTargets,
      "latestOfPreviousLine",
      previousLineVersions[previousLineVersions.length - 1],
    );
  }

  // --- alpha/prerelease fallback ---
  const isPrerelease = semver.prerelease(currentVersion) !== null;
  const categoriesCollapsed = new Set(semverTargets.map((t) => t.version)).size < 2;

  if (!isPrerelease || !categoriesCollapsed) {
    return semverTargets;
  }

  const offsets = options.offsets ?? DEFAULT_OFFSETS;
  const offsetTargets: ResolvedTarget[] = [];

  // previous still makes sense in prerelease mode
  push(offsetTargets, "previous", candidates[candidates.length - 1]);

  for (const offset of offsets) {
    // Step further back while the landing version is excluded.
    let index = candidates.length - 1 - offset;
    while (index >= 0 && excluded.has(candidates[index])) {
      index -= 1;
    }
    if (index >= 0) {
      push(offsetTargets, `offset-${offset}`, candidates[index]);
    }
  }

  return offsetTargets;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `corepack pnpm --filter @mittwald/flow-remote-react-components exec vitest run --project=unit-dev dev/cross-version/resolveCrossVersionTargets.test.ts`
Expected: PASS (all cases).

- [ ] **Step 6: Commit**

```bash
git add packages/remote-react-components/dev/cross-version/resolveCrossVersionTargets.ts \
        packages/remote-react-components/dev/cross-version/resolveCrossVersionTargets.test.ts \
        packages/remote-react-components/package.json pnpm-lock.yaml
git commit -m "feat(remote-react-components): add cross-version target resolver"
```

---

## Task 2: Exclude list config

**Files:**
- Create: `packages/remote-react-components/cross-version.exclude.json`

**Interfaces:**
- Produces: JSON file of shape `{ excluded: { version: string; reason: string }[] }`, consumed by the prepare script (Task 3).

- [ ] **Step 1: Create the exclude config (empty, documented via a reason field convention)**

Create `cross-version.exclude.json`:

```json
{
  "$comment": "Published versions to NEVER run cross-version smoke tests against (e.g. known-broken releases). Removing an entry re-includes that version. See CONTRIBUTE.md.",
  "excluded": []
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/remote-react-components/cross-version.exclude.json
git commit -m "feat(remote-react-components): add cross-version exclude list config"
```

---

## Task 3: Prepare script (resolve + install + manifest)

**Files:**
- Create: `packages/remote-react-components/dev/cross-version/prepare.ts`
- Modify: `packages/remote-react-components/package.json` (add `test:cross-version:prepare` script)
- Modify: `packages/remote-react-components/.gitignore` (create if absent)

**Interfaces:**
- Consumes: `resolveCrossVersionTargets` (Task 1), `cross-version.exclude.json` (Task 2).
- Produces:
  - `cross-version.manifest.json` of shape `{ resolvedAt: string; packageName: string; targets: { category: string; version: string; installPath: string }[] }`.
  - Installed packages at `node_modules/.cross-version/<version>/node_modules/@mittwald/flow-remote-react-components`.
  - `installPathFor(version: string): string` exported helper (used by Task 5 config).

- [ ] **Step 1: Write the prepare script**

Create `prepare.ts`:

```ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveCrossVersionTargets } from "./resolveCrossVersionTargets";

const PACKAGE_NAME = "@mittwald/flow-remote-react-components";
const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");
const installRoot = join(packageRoot, "node_modules", ".cross-version");

export const installPathFor = (version: string): string =>
  join(installRoot, version, "node_modules", PACKAGE_NAME);

const readCurrentVersion = (): string => {
  const pkg = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as { version: string };
  return pkg.version;
};

const readExcluded = (): string[] => {
  const config = JSON.parse(
    readFileSync(join(packageRoot, "cross-version.exclude.json"), "utf8"),
  ) as { excluded: { version: string }[] };
  return config.excluded.map((e) => e.version);
};

const fetchPublishedVersions = (): string[] => {
  const raw = execFileSync("npm", ["view", PACKAGE_NAME, "versions", "--json"], {
    encoding: "utf8",
  });
  return JSON.parse(raw) as string[];
};

const installVersion = (version: string): void => {
  const dir = join(installRoot, version);
  const target = installPathFor(version);
  if (existsSync(target)) {
    console.log(`[cross-version] ${version} already installed, skipping`);
    return;
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: `cross-version-${version}`, private: true }, null, 2),
  );
  console.log(`[cross-version] installing ${PACKAGE_NAME}@${version}`);
  execFileSync("npm", ["install", "--prefix", dir, `${PACKAGE_NAME}@${version}`], {
    stdio: "inherit",
  });
};

const main = (): void => {
  const currentVersion = readCurrentVersion();
  const published = fetchPublishedVersions();
  const excluded = readExcluded();

  const targets = resolveCrossVersionTargets(currentVersion, published, excluded);
  if (targets.length === 0) {
    console.warn("[cross-version] no target versions resolved — nothing to test");
  }

  mkdirSync(installRoot, { recursive: true });
  for (const target of targets) {
    installVersion(target.version);
  }

  const manifest = {
    resolvedAt: new Date().toISOString(),
    packageName: PACKAGE_NAME,
    targets: targets.map((t) => ({
      category: t.category,
      version: t.version,
      installPath: installPathFor(t.version),
    })),
  };
  writeFileSync(
    join(packageRoot, "cross-version.manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(
    `[cross-version] wrote manifest with ${targets.length} target(s): ` +
      targets.map((t) => `${t.category}=${t.version}`).join(", "),
  );
};

main();
```

> Note: `prepare.ts` calls `new Date()` — this runs as a plain node script (not inside a Workflow), so that is fine.

- [ ] **Step 2: Add the prepare script to package.json**

Add to `scripts` (after the `test:compile` entry):

```jsonc
"test:cross-version:prepare": "tsx dev/cross-version/prepare.ts",
```

If `tsx` is not already available at the repo root, use the node loader instead:

```jsonc
"test:cross-version:prepare": "node --experimental-strip-types dev/cross-version/prepare.ts",
```

Verify which is available:

Run: `corepack pnpm exec tsx --version`
Expected: prints a version (use `tsx`), else fall back to the `node --experimental-strip-types` form (Node ≥ 22.6; repo CI uses Node 24).

- [ ] **Step 3: Git-ignore generated artifacts**

Create/append `packages/remote-react-components/.gitignore`:

```gitignore
cross-version.manifest.json
node_modules/.cross-version/
```

- [ ] **Step 4: Run the prepare script (integration check)**

Run: `corepack pnpm --filter @mittwald/flow-remote-react-components test:cross-version:prepare`
Expected: installs 1–4 versions under `node_modules/.cross-version/`, writes `cross-version.manifest.json` with a non-empty `targets` array (in the current alpha state, offset-based targets like `offset-10`).

Verify:

Run: `cat packages/remote-react-components/cross-version.manifest.json`
Expected: valid JSON, each target has `category`, `version`, `installPath`, and each `installPath` exists on disk.

- [ ] **Step 5: Commit**

```bash
git add packages/remote-react-components/dev/cross-version/prepare.ts \
        packages/remote-react-components/package.json \
        packages/remote-react-components/.gitignore
git commit -m "feat(remote-react-components): add cross-version prepare script"
```

---

## Task 4: Spike — validate old-version render in Vitest browser (GO/NO-GO GATE)

This task de-risks the core assumption: an **installed old** `RemoteRoot` + old remote components can be paired with the **current** `RemoteRenderer`/`RemoteReceiver` in-process and render. If this fails, STOP and escalate (see fallback).

**Files:**
- Create: `packages/remote-react-components/dev/cross-version/vitest.config.ts`
- Create (temporary, deleted in Task 6): `packages/remote-react-components/dev/cross-version/__spike__/spike.browser.test.tsx`

**Interfaces:**
- Consumes: `installPathFor` (Task 3), `cross-version.manifest.json` (Task 3).

- [ ] **Step 1: Write the standalone cross-version Vitest config (spike form)**

Create `dev/cross-version/vitest.config.ts`:

```ts
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import defaultConfig from "../../vite.config";
import { vitestBrowserTestConfig } from "../../../core/src/vitestBrowserTestConfig";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");

interface Manifest {
  targets: { category: string; version: string; installPath: string }[];
}

const readManifest = (): Manifest => {
  try {
    return JSON.parse(
      readFileSync(join(packageRoot, "cross-version.manifest.json"), "utf8"),
    ) as Manifest;
  } catch {
    throw new Error(
      "cross-version.manifest.json missing. Run `test:cross-version:prepare` first.",
    );
  }
};

const manifest = readManifest();

// One alias per resolved version → its installed package directory.
const versionAliases = manifest.targets.map((t) => ({
  find: `@flr-crossversion/${t.version}`,
  replacement: t.installPath,
}));

export default mergeConfig(
  defaultConfig,
  defineConfig({
    resolve: { alias: versionAliases },
    optimizeDeps: {
      // Installed old bundles live outside the workspace; let Vite pre-bundle them.
      include: manifest.targets.map((t) => `@flr-crossversion/${t.version}`),
    },
    server: {
      fs: {
        // Allow serving the isolated install dir.
        allow: [packageRoot, join(packageRoot, "node_modules", ".cross-version")],
      },
    },
    test: {
      globals: true,
      ...vitestBrowserTestConfig,
      name: "cross-version",
      include: ["dev/cross-version/**/*.browser.test.{ts,tsx}"],
      setupFiles: "./dev/vitest/setupBrowser.ts",
    },
  }),
);
```

- [ ] **Step 2: Write the spike test against the first resolved version**

Create `dev/cross-version/__spike__/spike.browser.test.tsx`. Replace `<VERSION>` with the first `version` from the manifest:

```tsx
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { cleanup, render } from "vitest-browser-react";
import { expect, test } from "vitest";
import { useMemo, type FC, type PropsWithChildren } from "react";
// Old, installed version:
import OldRemoteRoot from "@flr-crossversion/<VERSION>/RemoteRoot";
import { Button as OldButton } from "@flr-crossversion/<VERSION>";

const Ui: FC<PropsWithChildren> = (props) => {
  const receiver = useMemo(() => new RemoteReceiver(), []);
  return (
    <>
      <RemoteRenderer __remoteReceiver={receiver} />
      <OldRemoteRoot __remoteReceiver={receiver}>{props.children}</OldRemoteRoot>
    </>
  );
};

test("old RemoteRoot renders a Button through the current host", async () => {
  await cleanup();
  const screen = await render(<Ui><OldButton>Hello</OldButton></Ui>);
  await expect.element(screen.getByRole("button", { name: "Hello" })).toBeVisible();
});
```

- [ ] **Step 3: Run the spike**

Run: `corepack pnpm --filter @mittwald/flow-remote-react-components exec vitest run --config=dev/cross-version/vitest.config.ts --browser.headless --browser.name=webkit`
Expected (GO): PASS — the old Button renders and is visible.

**If it FAILS (NO-GO):** capture the error and STOP. Likely causes + escalation:
- Module/exports resolution error → adjust `optimizeDeps.include` / `server.fs.allow`; retry once.
- Receiver interop error (old `RemoteRoot` rejects the current `RemoteReceiver`) → the in-process hook is incompatible across these versions. Escalate to the user: the fallback is the **e2e HTTP-iframe harness** (real connection), which was deprioritized in the design. Do not proceed to Tasks 5–6 until resolved.

- [ ] **Step 4: Commit the config (keep spike test uncommitted for now, or commit and remove in Task 6)**

```bash
git add packages/remote-react-components/dev/cross-version/vitest.config.ts
git commit -m "feat(remote-react-components): add cross-version vitest config"
```

---

## Task 5: Virtual environments module (one test environment per version)

**Files:**
- Create: `packages/remote-react-components/dev/cross-version/crossVersionEnvironmentsPlugin.ts`
- Modify: `packages/remote-react-components/dev/cross-version/vitest.config.ts` (register plugin + alias override)

**Interfaces:**
- Consumes: the manifest + version aliases (Task 4).
- Produces: a virtual module resolvable as `@/tests/lib/environments` (within the cross-version config only) exporting `testEnvironments: TestEnvironement[]` — one per resolved version — matching the shape in `src/tests/lib/environments.tsx` (`{ toString, components, render, container, testScreenshot }`).

- [ ] **Step 1: Write the virtual-module plugin**

Create `crossVersionEnvironmentsPlugin.ts`:

```ts
import type { Plugin } from "vite";

interface Target {
  category: string;
  version: string;
}

const VIRTUAL_ID = "virtual:cross-version-environments";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

/**
 * Generates an `environments` module that provides one TestEnvironement per
 * resolved old version: each renders through the OLD RemoteRoot + OLD remote
 * components (via the per-version alias) paired with the CURRENT host
 * RemoteRenderer/RemoteReceiver, screenshotting against the shared baseline.
 *
 * The cross-version vitest config aliases `@/tests/lib/environments` to this
 * virtual module, so the unmodified subset test files pick it up transparently.
 */
export function crossVersionEnvironmentsPlugin(targets: Target[]): Plugin {
  return {
    name: "cross-version-environments",
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID;
      }
    },
    load(id) {
      if (id !== RESOLVED_ID) {
        return;
      }
      const imports = targets
        .map(
          (t, i) => `
import RemoteRoot_${i} from "@flr-crossversion/${t.version}/RemoteRoot";
import * as Components_${i} from "@flr-crossversion/${t.version}";`,
        )
        .join("");

      const envs = targets
        .map(
          (t, i) => `
  {
    toString: () => ${JSON.stringify(`Remote@${t.version}`)},
    components: Components_${i},
    render: makeRenderRemote(RemoteRoot_${i}),
    container: rootContainerLocator,
    testScreenshot,
  },`,
        )
        .join("");

      return `
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { NotificationProvider } from "@mittwald/flow-react-components";
import { cleanup, render } from "vitest-browser-react";
import { useMemo } from "react";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect } from "vitest";
${imports}

const setNeutralPointerPosition = async () => {
  await rootContainerLocator.unhover();
  rootContainerLocator.element().focus();
};

const testScreenshot = async (description, options = {}) => {
  await setNeutralPointerPosition();
  await expect(rootContainerLocator).toMatchScreenshot(description, options);
};

function makeRenderRemote(RemoteRoot) {
  return async (ui, options) => {
    await cleanup();
    const RemoteTestUi = ({ children }) => {
      const receiver = useMemo(() => new RemoteReceiver(), []);
      return (
        <RootContainer>
          <RemoteRenderer __remoteReceiver={receiver} />
          <RemoteRoot __remoteReceiver={receiver}>
            <NotificationProvider>{children}</NotificationProvider>
          </RemoteRoot>
        </RootContainer>
      );
    };
    const result = await render(<RemoteTestUi>{ui}</RemoteTestUi>, options);
    await setNeutralPointerPosition();
    return result;
  };
}

export const testEnvironments = [${envs}
];
`;
    },
  };
}
```

> The generated module is JSX; Vitest's React plugin (in `defaultConfig`) transforms `.load()` output. If the transform does not apply to virtual ids in this setup (verify during the spike-adjacent run), rename the virtual id to end in `.tsx` or move the JSX-heavy `makeRenderRemote` into a small real helper file imported by the virtual module. Prefer the latter if needed.

- [ ] **Step 2: Wire the plugin + alias override into the config**

Edit `dev/cross-version/vitest.config.ts`: import the plugin and add it, and alias `@/tests/lib/environments` to the virtual module (place the override BEFORE any broad `@` alias):

```ts
import { crossVersionEnvironmentsPlugin } from "./crossVersionEnvironmentsPlugin";
```

In the `defineConfig({...})` object add:

```ts
    plugins: [crossVersionEnvironmentsPlugin(manifest.targets)],
    resolve: {
      alias: [
        {
          find: /^@\/tests\/lib\/environments$/,
          replacement: "virtual:cross-version-environments",
        },
        ...versionAliases,
      ],
    },
```

(Remove the standalone `resolve: { alias: versionAliases }` added in Task 4 — it is replaced by this combined block.)

- [ ] **Step 3: Point the spike test at the virtual environments (sanity)**

Temporarily rewrite `dev/cross-version/__spike__/spike.browser.test.tsx` to consume the injected environments (this proves the injection path the subset relies on):

```tsx
import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)("injected env renders a Button (%s)", async ({
  render,
  components: { Button },
}) => {
  const screen = await render(<Button>Hello</Button>);
  await expect.element(screen.getByRole("button", { name: "Hello" })).toBeVisible();
});
```

- [ ] **Step 4: Run to verify injection works**

Run: `corepack pnpm --filter @mittwald/flow-remote-react-components exec vitest run --config=dev/cross-version/vitest.config.ts --browser.headless --browser.name=webkit`
Expected: PASS — one test per resolved version, each rendering the Button.

- [ ] **Step 5: Commit**

```bash
git add packages/remote-react-components/dev/cross-version/crossVersionEnvironmentsPlugin.ts \
        packages/remote-react-components/dev/cross-version/vitest.config.ts
git commit -m "feat(remote-react-components): inject one test env per old version"
```

---

## Task 6: Curated subset + green screenshot run

**Files:**
- Create: `packages/remote-react-components/dev/cross-version/subset.ts`
- Modify: `packages/remote-react-components/dev/cross-version/vitest.config.ts` (include the subset instead of the spike glob)
- Delete: `packages/remote-react-components/dev/cross-version/__spike__/spike.browser.test.tsx`

**Interfaces:**
- Consumes: existing visual test files under `src/tests/visual/`.
- Produces: `SUBSET: string[]` — ~10 relative globs of existing visual test files.

- [ ] **Step 1: Pick the ~10 representative files**

Run: `ls packages/remote-react-components/src/tests/visual/*.browser.test.tsx`
Expected: the full list. Choose ~10 spanning component kinds (buttons, inputs, overlays, content, layout). Recommended default set:

```
Button, TextField, Select, Checkbox, Modal, ContextMenu, Form, Markdown, Table, Alert
```
(Adjust names to the actual files present.)

- [ ] **Step 2: Write the subset include-list**

Create `dev/cross-version/subset.ts`:

```ts
/**
 * Curated ~10 visual tests run cross-version (representative coverage across
 * component kinds). Keep this list intentional, not exhaustive — see CONTRIBUTE.md.
 */
export const SUBSET = [
  "src/tests/visual/Button.browser.test.tsx",
  "src/tests/visual/TextField.browser.test.tsx",
  "src/tests/visual/Select.browser.test.tsx",
  "src/tests/visual/Checkbox.browser.test.tsx",
  "src/tests/visual/Modal.browser.test.tsx",
  "src/tests/visual/ContextMenu.browser.test.tsx",
  "src/tests/visual/Form.browser.test.tsx",
  "src/tests/visual/Markdown.browser.test.tsx",
  "src/tests/visual/Table.browser.test.tsx",
  "src/tests/visual/Alert.browser.test.tsx",
];
```

(Verify each path exists; drop/replace any that do not.)

- [ ] **Step 3: Use the subset in the config**

Edit `dev/cross-version/vitest.config.ts`: import `SUBSET` and set `test.include = SUBSET`. Remove the `dev/cross-version/**/*.browser.test.{ts,tsx}` glob.

```ts
import { SUBSET } from "./subset";
// ...
      include: SUBSET,
```

- [ ] **Step 4: Delete the spike test**

```bash
rm packages/remote-react-components/dev/cross-version/__spike__/spike.browser.test.tsx
```

- [ ] **Step 5: Run the cross-version subset (compare against existing baselines)**

Run: `corepack pnpm --filter @mittwald/flow-remote-react-components exec vitest run --config=dev/cross-version/vitest.config.ts --browser.headless --browser.name=webkit --browser.fileParallelism=false`
Expected: PASS — each subset test renders under every resolved version and matches the existing `<Name>-<browser>-<os>.png` baseline. A mismatch = a real backwards-compat signal (or a prop-contract gap in that old version); investigate before proceeding.

> No new baselines are created: cross-version envs reuse the existing descriptions and thus the existing baseline files. Do **not** commit any `*--Remote@<version>--*.png` diff artifacts.

- [ ] **Step 6: Commit**

```bash
git add packages/remote-react-components/dev/cross-version/subset.ts \
        packages/remote-react-components/dev/cross-version/vitest.config.ts
git rm packages/remote-react-components/dev/cross-version/__spike__/spike.browser.test.tsx
git commit -m "feat(remote-react-components): run curated subset cross-version"
```

---

## Task 7: nx wiring (scripts + caching + affected)

**Files:**
- Modify: `packages/remote-react-components/package.json` (add run scripts)
- Modify: `packages/remote-react-components/project.json` (inputs/outputs/dependsOn)
- Modify: `nx.json` (targetDefaults)

**Interfaces:**
- Produces: nx targets `test:cross-version`, `test:cross-version:prepare` (from Task 3), `test:cross-version:update`, `test:cross-version:dev`.

- [ ] **Step 1: Add run scripts to package.json**

Add to `scripts`:

```jsonc
"test:cross-version": "vitest run --config=dev/cross-version/vitest.config.ts --browser.headless --browser.fileParallelism=false",
"test:cross-version:dev": "vitest dev --config=dev/cross-version/vitest.config.ts",
"test:cross-version:update": "vitest run --config=dev/cross-version/vitest.config.ts --browser.headless --update --browser.fileParallelism=false",
```

- [ ] **Step 2: Add nx targetDefaults**

Edit `nx.json` `targetDefaults`, add:

```jsonc
"test:cross-version:prepare": {
  "dependsOn": ["^build"],
  "cache": false
},
"test:cross-version": {
  "dependsOn": ["^build", "test:cross-version:prepare"],
  "cache": true
},
"test:cross-version:update": {
  "dependsOn": ["^build", "test:cross-version:prepare"],
  "cache": true
}
```

- [ ] **Step 3: Add project-level inputs/outputs**

Edit `packages/remote-react-components/project.json` `targets`, add (the manifest and installed dir are runtime inputs, not source — declare them so caching is correct and stale results are not served):

```jsonc
"test:cross-version": {
  "inputs": [
    "default",
    "{projectRoot}/dev/cross-version/**/*",
    "{projectRoot}/cross-version.manifest.json",
    "{projectRoot}/src/tests/visual/**/*"
  ]
}
```

- [ ] **Step 4: Verify nx resolves the target**

Run: `pnpm nx show project remote-react-components --json`
Expected: JSON lists `test:cross-version`, `test:cross-version:prepare`, `test:cross-version:update`, `test:cross-version:dev` under `targets`.

- [ ] **Step 5: Commit**

```bash
git add packages/remote-react-components/package.json \
        packages/remote-react-components/project.json nx.json
git commit -m "chore(remote-react-components): wire cross-version nx targets"
```

---

## Task 8: Scheduled CI job

**Files:**
- Modify: `.github/workflows/test-visual-scheduled.yml`

- [ ] **Step 1: Add a `cross-version` job**

Append a new job to `.github/workflows/test-visual-scheduled.yml` (sibling of `main`). It prepares versions (network), then runs the cross-version subset with the same 3-attempt retry + Slack alert pattern:

```yaml
  cross-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Prepare browser tests
        run: pnpm test:browser:prepare --only-shell

      - name: Prepare cross-version packages
        run: corepack pnpm --filter @mittwald/flow-remote-react-components test:cross-version:prepare

      - name: Run cross-version smoke tests
        run: |
          for attempt in 1 2 3; do
            echo "::group::Cross-version tests (attempt $attempt/3)"
            if pnpm nx run-many -t test:cross-version --parallel=1 --browser.fileParallelism=false; then
              echo "::endgroup::"
              exit 0
            fi
            echo "::endgroup::"
            echo "::warning::Cross-version tests failed on attempt $attempt/3, retrying..."
          done
          echo "::error::Cross-version tests still failing after 3 attempts."
          exit 1

      - name: Send alerting message to Slack
        if: failure()
        uses: slackapi/slack-github-action@v2.1.1
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            text: "Cross-version remote tests failed"
            blocks:
              - type: "section"
                text:
                  type: "mrkdwn"
                  text: "Cross-version remote smoke tests failed. See the [failed action](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})."
```

- [ ] **Step 2: Validate workflow syntax**

Run: `corepack pnpm exec prettier --check .github/workflows/test-visual-scheduled.yml`
Expected: passes (or run `--write` then re-check). If `actionlint` is available, run it too.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/test-visual-scheduled.yml
git commit -m "ci: run cross-version remote smoke tests on schedule"
```

---

## Task 9: Docs

**Files:**
- Modify: `packages/remote-react-components/CONTRIBUTE.md`

- [ ] **Step 1: Add a "Cross-version smoke tests" section**

Append to `CONTRIBUTE.md`:

```markdown
## Cross-version smoke tests

These verify that **previously-published** remote versions still render correctly
through the **current** host — i.e. backwards compatibility of the flr-element /
prop contract. A curated subset (~10) of the visual tests runs each old version's
`RemoteRoot` + remote components against the current `RemoteRenderer`, comparing
to the **same** baselines as the normal visual tests. A diff means the current
host changed how a fixed old bundle renders (a compat regression) — or that the
old version legitimately lacks a prop the current host now expects.

### Running locally

```shell
# resolve + install the old versions (queries npm, writes cross-version.manifest.json)
corepack pnpm --filter @mittwald/flow-remote-react-components test:cross-version:prepare
# run the subset (webkit shown; omit --browser.name for all browsers)
corepack pnpm --filter @mittwald/flow-remote-react-components test:cross-version --browser.name=webkit
```

Generated artifacts (`cross-version.manifest.json`, `node_modules/.cross-version/`)
are git-ignored. `*--Remote@<version>--*.png` diff files are failure artifacts —
never commit them.

### Which versions are tested

`dev/cross-version/resolveCrossVersionTargets.ts` picks versions by semver
category (previous / first-of-line / latest-of-previous-line). While everything
is a single `0.2.0-alpha.*` prerelease line the categories collapse, so it falls
back to computed offsets (10 / 100 / 200 versions back).

### Excluding a broken version

Add it to `cross-version.exclude.json` with a `reason`. The resolver skips it and
steps to the next valid candidate. Remove the entry to re-include it once fixed.

### CI

Runs in `.github/workflows/test-visual-scheduled.yml` (twice daily, all browsers),
not on PRs.
```

- [ ] **Step 2: Format**

Run: `corepack pnpm exec prettier --write packages/remote-react-components/CONTRIBUTE.md`
Expected: formatted, no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/remote-react-components/CONTRIBUTE.md
git commit -m "docs(remote-react-components): document cross-version smoke tests"
```

---

## Self-Review notes

- **Spec coverage:** resolver + semver categories + alpha fallback (Task 1) ✓; exclude list (Tasks 1–2) ✓; manifest-driven install (Task 3) ✓; in-process harness with per-version envs (Tasks 4–5) ✓; curated include-list subset (Task 6) ✓; shared baseline (Task 6, by reusing descriptions) ✓; nx wiring (Task 7) ✓; scheduled-only CI (Task 8) ✓; docs (Task 9) ✓; Vite-resolution risk spiked first (Task 4) ✓.
- **Type consistency:** `resolveCrossVersionTargets(currentVersion, publishedVersions, excludedVersions?, options?)` and `ResolvedTarget { category, version }` are used identically across Tasks 1/3/4/5. `installPathFor` (Task 3) is consumed by the manifest, read by Task 4/5 configs. `TestEnvironement` shape matches `src/tests/lib/environments.tsx`.
- **Known open risk:** Task 4 is a genuine go/no-go — if old `RemoteRoot` cannot share the current `RemoteReceiver` in-process, escalate to the e2e HTTP-iframe fallback rather than forcing the in-process path.
