# Flow codemods `upgrade` CLI + migration catalogue — Implementation Plan

> **Status:** historical execution plan. Implementation superseded parts of it
> as work progressed — the code and its own tests are the ground truth for
> anything that diverges. [ADR 0006](../../adr/0006-migration-catalogue.md) is
> the authority on the design; read that first for the current shape.

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `@mittwald/flow-codemods` as a CLI whose `upgrade` command
bumps every Flow dependency to a resolved target version, installs, and runs
exactly the codemods the crossed version range requires — backed by a
machine-readable migration catalogue that also generates `MIGRATION.md`.

**Architecture:** One catalogue of markdown files with YAML frontmatter
(`src/migrations/<id>.md`) is the single source of truth for every migration,
with or without a codemod. A generator turns it into a committed, typed
`migrations.generated.ts` module (consumed at runtime by the CLI, and by agents
through `list --json`) and into `packages/components/MIGRATION.md` (consumed by
humans). All version logic lives in three pure modules — gate selection, target
resolution, manifest rewriting — with I/O (npm registry, install, git,
jscodeshift) pushed to the edges so the interesting behaviour is testable
without network, filesystem, or a TTY. The raw-GitHub-URL delivery path is
retired, which removes the self-contained-transform rule, the composite bundler,
and `standalone.test.ts`.

**Tech Stack:** TypeScript (ESM, `type: module`), Node >= 24, vitest,
jscodeshift 17, `semver`, `@inquirer/prompts`, `yaml` (dev only — frontmatter is
parsed by the generator, never at runtime), `tsc` for the `dist` build, nx for
task orchestration.

## Global Constraints

- **Node floor:** `>=24`, declared uniformly across packages (ADR 0005 §2). Do
  not raise it.
- **New dependencies:** pnpm enforces `minimumReleaseAge` of one week
  (`@mittwald/*` exempt). Brand-new versions will not resolve — pick a version
  published more than a week ago.
- **Package manager:** pnpm, pinned via `packageManager`. Use **bare
  `pnpm nx …`** for anything with `dependsOn`/`^build`;
  `corepack pnpm --filter <pkg> <script>` only for single-package scripts.
- **Commits:** Conventional Commits with a scope — `feat(codemods): …`. The repo
  squash-merges, so the PR title becomes the release commit.
- **Base branch: `next`.** This is a `feat:`;
  `.github/workflows/commit-guard.yml` rejects a `feat:` targeting `main`. Not
  `feat!:` — see "Why this is not a breaking change" below.
- **Prose language:** English for commits, PR bodies, `docs/`, ADRs, and all
  `AGENTS.md`/`MIGRATION.md` content. German only for
  `apps/docs/src/content/**`.
- **Writing style** (AGENTS.md): dense and simple. Lead with the point, no
  filler, no marketing adjectives, no summary that repeats the body.
- **Generated files are committed.** CI runs `git diff --exit-code` after
  building. Every generator output in this plan must be committed in the same
  commit as its source.
- **Never hand-edit a generated file.** After this plan lands,
  `packages/components/MIGRATION.md` and
  `packages/codemods/src/migrations.generated.ts` are generated.
- **Relative imports in anything compiled into `dist` MUST carry a `.js`
  extension** — `import { x } from "./catalog/entries.js"`. The shared config
  sets `"module": "preserve"`, so TypeScript type-checks an extensionless import
  and then emits it unchanged; under Node ESM that throws `ERR_MODULE_NOT_FOUND`
  at run time. Every other package in this repo is consumed by a bundler that
  resolves extensionless specifiers, so this package is the first whose emitted
  output Node executes directly. **The code snippets below were written without
  the extension — add it.** It does not apply to `src/tests/**` or `dev/**`,
  which vitest and tsx run from source, but adding it there is harmless.
- **`tsconfig.build.json` may need `"types": ["node"]`.** This repo's bare `tsc`
  resolves to the native TypeScript compiler (see the `pnpm-workspace.yaml`
  overrides), which does not auto-discover `@types/node` for the build config's
  small program. `tsconfig.json`'s `include` also needs `"package.json"`, or
  `src/cli.ts`'s JSON import fails with TS6307. Both were established in Task 1.
- **`semver` is CommonJS.** Named imports (`import { lt, lte } from "semver"`)
  rely on Node's CJS named-export detection, which works for `semver@7`. If any
  of them resolves as `undefined` at run time, switch that module to
  `import semver from "semver"` and call `semver.lt(...)` — do not reach for
  `semver/functions/*` deep imports, which are not in its `exports` map.
- **Prettier:** `pnpm format` before committing; `pnpm lint` includes
  `format:check` and runs in the `pre-push` hook, so an unformatted
  `.md`/`.json` blocks the push.

## Design decisions this plan implements

Settled during brainstorming; do not re-litigate them mid-implementation.

| Decision                                     | Value                                                                                                                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Delivery                                     | Publish `@mittwald/flow-codemods` with a `bin`. The raw-GitHub-URL path is **retired**.                                                                     |
| Broken URLs in shipped `MIGRATION.md` copies | Accepted by the maintainer. No aliases, no shims.                                                                                                           |
| Codemod ids                                  | Dashed, lowercase, no `flow`/`flowAlpha` prefix. The id is the transform file name **and** the `MIGRATION.md` anchor.                                       |
| Gate                                         | Exact-version, not major/minor/patch granularity. `migration`: `current < since <= target`. `deprecation`: `since <= target`.                               |
| `revision` argument                          | `patch` \| `minor` \| `major` \| dist-tag \| exact version. Default `minor`. Keywords bound the **target**; the gate then derives the codemod set.          |
| Prereleases                                  | Excluded from keyword resolution. Only an explicit dist-tag or exact version reaches a `-next.N`.                                                           |
| Steps                                        | bump → install → codemods. No `--no-install` flag; the installer is a module seam for tests instead.                                                        |
| Catalogue coverage                           | **All** entries, including the two pre-`0.2.0` ones. `MIGRATION.md` becomes 100 % generated.                                                                |
| Deprecated APIs with no guide entry today    | Task 15, a follow-up. The 22 ported entries cover what `MIGRATION.md` already documents; the deprecated APIs that were never written up are their own task. |
| Helper deduplication                         | Free consequence of retiring the URL path (transforms may import), but **not** a goal. Do not refactor the eight transforms' internals in this plan.        |
| `packages/ext-bridge/MIGRATION.md`           | Out of scope. It keeps its own hand-written guide.                                                                                                          |

**Why this is not a breaking change:** `@mittwald/flow-codemods` is
`private: true` today, so no published package API changes. What breaks are
raw-GitHub URLs printed inside already-shipped `MIGRATION.md` copies. Doc URLs
are not part of the semver contract (ADR 0005 §1), and the maintainer explicitly
accepted the 404s.

## Sequencing

**PR #2942 is not a dependency.** Its useful parts are pulled into this branch
directly (Task 0), and it is superseded. That is a decision with a consequence
worth stating: if #2942 later merges to `main`, the forward-merge into `next`
will conflict hard, because this work renames every file it touches. Close it
when Task 0 lands.

1. **Task 0** brings in what #2942 built and leaves behind what this design
   retires.
2. **Re-base onto `next`.** The branch sits on `main`, which is wrong for a
   `feat:` — the commit-guard rejects it.
3. After any merge from `main`, check `packages/*/package.json` versions: the
   `merge=package-json` driver keeps _our_ `version` field and silently reverts
   a release bump, with no conflict markers.

## File structure

**Created**

| Path                                                 | Responsibility                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `packages/codemods/src/catalog/types.ts`             | The `MigrationEntry` type and its two enums. No logic.                     |
| `packages/codemods/src/catalog/read.ts`              | Parse and validate `src/migrations/*.md` frontmatter. Build-time only.     |
| `packages/codemods/src/catalog/entries.ts`           | Re-exports the generated catalogue. The only module that imports it.       |
| `packages/codemods/src/catalog/select.ts`            | **Pure.** The two gates.                                                   |
| `packages/codemods/src/resolve/target.ts`            | **Pure.** `revision` + available versions → target.                        |
| `packages/codemods/src/resolve/registry.ts`          | npm registry query (versions + dist-tags). I/O.                            |
| `packages/codemods/src/manifest.ts`                  | **Pure.** Find Flow deps, rewrite ranges, detect current version.          |
| `packages/codemods/src/install.ts`                   | Package-manager detection and the `InstallRunner` seam. I/O.               |
| `packages/codemods/src/git.ts`                       | Dirty-tree check. I/O.                                                     |
| `packages/codemods/src/run/jscodeshift.ts`           | Spawn jscodeshift for one codemod id. I/O.                                 |
| `packages/codemods/src/cli.ts`                       | Argument parsing, prompts, orchestration. The only TTY-aware module.       |
| `packages/codemods/src/flowPackages.generated.ts`    | Generated list of published workspace package names.                       |
| `packages/codemods/src/migrations.generated.ts`      | Generated catalogue module, frontmatter only. Typed, compiled into `dist`. |
| `packages/codemods/src/migrations/<id>.md`           | 23 authored files: 22 migrations + `to-remote-package` (`kind: tool`).     |
| `packages/codemods/dev/generate/migrationsModule.ts` | Catalogue → `src/migrations.generated.ts`.                                 |
| `packages/codemods/dev/generate/migrationGuide.ts`   | Catalogue → `packages/components/MIGRATION.md`.                            |
| `packages/codemods/dev/generate/flowPackages.ts`     | Workspace → `flowPackages.generated.ts`.                                   |
| `packages/codemods/dev/generateCli.ts`               | Runs all three generators.                                                 |
| `packages/codemods/tsconfig.build.json`              | Emit config for `dist`.                                                    |
| `docs/adr/0006-migration-catalogue.md`               | Records the catalogue as the single source.                                |

**Modified**

| Path                                                        | Change                                                         |
| ----------------------------------------------------------- | -------------------------------------------------------------- |
| `packages/codemods/package.json`                            | Drop `private`, add `bin`/`files`/`dependencies`, new scripts. |
| `packages/codemods/project.json`                            | nx targets for the generators and the `dist` build.            |
| `packages/codemods/AGENTS.md`                               | Remove the standalone rule; document the catalogue.            |
| `packages/codemods/src/transforms/*.ts`                     | Renamed to dashed ids.                                         |
| `packages/codemods/src/tests/*.test.ts`                     | Renames; new catalogue invariants.                             |
| `packages/components/MIGRATION.md`                          | Becomes generated.                                             |
| `apps/docs/src/content/01-get-started/versioning/index.mdx` | § "Nutze den Codemod" → the CLI (German).                      |
| `AGENTS.md` (root)                                          | Repo map row, generated-code table, migration-entry bullet.    |

**Never brought in from #2942** (Task 0 leaves them behind)

| Path                                                    | Why                                                                                                                                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev/bundleComposites.ts`, `dev/bundleCompositesCli.ts` | The composite bundler exists only to serve the URL path.                                                                                                                                |
| `src/composites/flow1.ts`, `src/transforms/flow1.ts`    | The CLI runs codemods individually and reports per codemod.                                                                                                                             |
| `src/tests/bundledComposites.test.ts`                   | Nothing left to bundle.                                                                                                                                                                 |
| `src/tests/standalone.test.ts`                          | Transforms no longer have to run from a temp directory alone.                                                                                                                           |
| `src/tests/documented.test.ts`                          | Task 3 writes the catalogue-based replacement. Bringing the URL-scanning version in would fail immediately, because the four transforms #2942 added are not linked from `main`'s guide. |

**Deleted from `main`**

| Path                                               | Why                                                                                                       |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `packages/codemods/src/transforms/flowAlphaAll.ts` | The hand-written composite with relative imports — the bug #2942 was opened for. Superseded by `upgrade`. |

---

## Task 0: Pull the foundation out of PR #2942

**Files:** see the tables below. No new code — this task moves existing,
reviewed, green code onto this branch and drops what the design retires.

**Interfaces:**

- Consumes: nothing.
- Produces: a `packages/codemods` with a working test harness (`runTransform`),
  the remote-scope authority (`remoteScope.ts`), nine transforms,
  `vitest.config.ts` and `project.json`. Every later task builds on these.

PR #2942 is reviewed and CI-green. Re-deriving its work would be waste, and two
parts of it are load-bearing here:

- It **rewrote `flowAlphaAlignToCombine.ts`** (+155/−38) to resolve names
  through named, aliased and namespace imports. `main`'s version does not.
- It **added real migration prose to `MIGRATION.md`** — the AccentBox entry now
  explains that `color` was re-meant rather than renamed, gives the per-value
  decision rules, and notes that `<AccentBox color="blue">` currently renders
  the neutral background. Task 3 copies bodies verbatim from this file, so
  `main`'s thinner version would lose content.

- [ ] **Step 1: Make the PR branch available as a local ref**

```bash
git fetch origin claude/flowalphall-codemod-error-89c0db:refs/pr2942 --force
git rev-parse --short refs/pr2942
```

Expected: a commit hash. Everything below reads from `refs/pr2942`.

- [ ] **Step 2: Take the four transforms #2942 added**

```bash
git checkout refs/pr2942 -- \
  packages/codemods/src/transforms/flowAlphaAccentBoxColorToBackgroundColor.ts \
  packages/codemods/src/transforms/flowAlphaButtonPropsInterfaces.ts \
  packages/codemods/src/transforms/flowAlphaMutedActionErrorToAbortActionError.ts \
  packages/codemods/src/transforms/flowAlphaPasswordToolsRule.ts
```

- [ ] **Step 3: Take the improved versions of the transforms already on `main`**

```bash
git checkout refs/pr2942 -- \
  packages/codemods/src/transforms/flow020.ts \
  packages/codemods/src/transforms/flowAlphaActionPropToOnAction.ts \
  packages/codemods/src/transforms/flowAlphaAlignToCombine.ts
```

`flowAlphaButtonColorAccentToSuccess.ts`, `flowAlphaColorPrimaryToDefault.ts`
and `flowRemote.ts` are byte-identical in both branches — nothing to do for
them.

- [ ] **Step 4: Take the test harness, the remote-scope authority, and the
      configs**

```bash
git checkout refs/pr2942 -- \
  packages/codemods/src/tests/runTransform.ts \
  packages/codemods/src/tests/transforms.test.ts \
  packages/codemods/src/tests/idempotency.test.ts \
  packages/codemods/src/tests/flowAlphaAccentBoxColorToBackgroundColor.test.ts \
  packages/codemods/src/tests/remoteScope.ts \
  packages/codemods/src/tests/remoteScope.test.ts \
  packages/codemods/vitest.config.ts \
  packages/codemods/project.json \
  packages/codemods/AGENTS.md \
  packages/codemods/package.json \
  packages/codemods/tsconfig.json \
  packages/components/MIGRATION.md
```

`MIGRATION.md` is taken as the **body source** for Task 3, even though Task 3
regenerates the file. That also makes Task 3's diff review meaningful: it
compares against the richer version, so a lost paragraph shows up.

- [ ] **Step 5: Delete the broken composite, and do not bring its replacement**

```bash
git rm packages/codemods/src/transforms/flowAlphaAll.ts
```

Do **not** check out `dev/bundleComposites.ts`, `dev/bundleCompositesCli.ts`,
`src/composites/flow1.ts`, `src/transforms/flow1.ts`,
`src/tests/bundledComposites.test.ts`, `src/tests/standalone.test.ts` or
`src/tests/documented.test.ts`. The first six exist only to serve the URL path;
the seventh scans guides for URLs and would fail at once, because `main`'s guide
does not link the four transforms from Step 2. Task 3 writes its catalogue-based
replacement.

- [ ] **Step 6: Reconcile what the missing files leave behind**

Four loose ends from not taking the bundler:

0. `packages/codemods/src/tests/remoteScope.test.ts` — its
   `test("every transform is listed")` asserts that the transform file names on
   disk are exactly the keys of its hand-maintained `targets` map, and that map
   has a `flow1` key. Since `flow1.ts` is not coming across, **this test fails
   until you drop it**: remove the `flow1: []` entry from `targets` and
   `"flow1"` from the `notNameScoped` set, and drop the sentence about `flow1`
   from the comment above `notNameScoped`.

1. `packages/codemods/package.json` — its `build` script points at
   `dev/bundleCompositesCli.ts`, which does not exist here. Set
   `"build": "tsc --noEmit"` as a placeholder; Task 1 replaces it properly.
2. `packages/codemods/project.json` — remove
   `"!{projectRoot}/src/transforms/flow1.ts"` from the `codemods-src` named
   input and drop the `outputs` entry for it. There is no generated transform
   yet.
3. `packages/codemods/AGENTS.md` — leave it as-is. It still documents the
   standalone rule, which is now wrong; Task 14 rewrites it. Do not half-fix it
   here.

- [ ] **Step 7: Install and verify the foundation is green**

```bash
pnpm install
pnpm test:browser:prepare   # only if Playwright is not yet installed in this worktree
pnpm nx test:unit codemods
pnpm nx test:compile codemods
```

Expected: PASS. The suite is smaller than #2942's — no `standalone`, no
`bundledComposites`, no `documented` — so expect roughly 60 tests rather
than 74. Every remaining one must pass; a failure here means a file was taken
without its dependency.

- [ ] **Step 8: Commit**

```bash
git add -A packages/codemods packages/components/MIGRATION.md pnpm-lock.yaml
git commit -m "feat(codemods): adopt the transform suite and test harness from #2942"
```

---

## Task 1: Make the package publishable and stand up the CLI entry point

**Files:**

- Create: `packages/codemods/src/cli/args.ts`
- Create: `packages/codemods/src/cli.ts`
- Create: `packages/codemods/tsconfig.build.json`
- Create: `packages/codemods/src/tests/args.test.ts`
- Create: `packages/codemods/src/tests/bin.test.ts`
- Modify: `packages/codemods/package.json`
- Modify: `packages/codemods/tsconfig.json`

**Interfaces:**

- Consumes: nothing.
- Produces: `parseArguments(argv: string[]): ParsedCommand` and the
  `ParsedCommand` interface from `src/cli/args.ts`. Every later CLI task adds a
  branch to `src/cli.ts` keyed on `ParsedCommand.command`.

- [ ] **Step 1: Write the failing test for argument parsing**

Create `packages/codemods/src/tests/args.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { parseArguments } from "../cli/args";

describe("parseArguments", () => {
  test("no arguments asks for help", () => {
    expect(parseArguments([])).toMatchObject({ command: "help" });
  });

  test("--help and -h ask for help", () => {
    expect(parseArguments(["--help"])).toMatchObject({ command: "help" });
    expect(parseArguments(["-h"])).toMatchObject({ command: "help" });
  });

  test("--version asks for the version", () => {
    expect(parseArguments(["--version"])).toMatchObject({ command: "version" });
  });

  test("upgrade defaults its revision to minor", () => {
    expect(parseArguments(["upgrade"])).toMatchObject({
      command: "upgrade",
      revision: "minor",
    });
  });

  test("upgrade takes a revision", () => {
    expect(parseArguments(["upgrade", "next"])).toMatchObject({
      command: "upgrade",
      revision: "next",
    });
  });

  test("upgrade collects its flags", () => {
    expect(
      parseArguments(["upgrade", "major", "-y", "--allow-dirty", "--dry"]),
    ).toMatchObject({
      command: "upgrade",
      revision: "major",
      yes: true,
      allowDirty: true,
      dry: true,
    });
  });

  test("list takes a range and --json", () => {
    expect(
      parseArguments(["list", "--from", "1.0.0", "--to", "1.2.0", "--json"]),
    ).toMatchObject({
      command: "list",
      from: "1.0.0",
      to: "1.2.0",
      json: true,
    });
  });

  test("an unknown first positional is a codemod id with an optional path", () => {
    expect(parseArguments(["align-to-combine", "src"])).toMatchObject({
      command: "codemod",
      id: "align-to-combine",
      path: "src",
    });
  });

  test("a codemod without a path leaves it unset", () => {
    expect(parseArguments(["align-to-combine"])).toMatchObject({
      command: "codemod",
      id: "align-to-combine",
      path: undefined,
    });
  });

  test("an unknown flag is an error, not a silent no-op", () => {
    expect(() => parseArguments(["upgrade", "--nope"])).toThrow();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/args.test.ts`
Expected: FAIL — `Failed to resolve import "../cli/args"`.

- [ ] **Step 3: Implement the parser**

Create `packages/codemods/src/cli/args.ts`:

```ts
import { parseArgs } from "node:util";

export type Command = "upgrade" | "list" | "codemod" | "help" | "version";

export interface ParsedCommand {
  command: Command;
  /**
   * `upgrade` only. `patch` | `minor` | `major` | a dist-tag | an exact
   * version.
   */
  revision?: string;
  /** `codemod` only. */
  id?: string;
  /** Sources to transform. Unset means "decide at run time". */
  path?: string;
  /** `list` only. Both bounds are optional. */
  from?: string;
  to?: string;
  json: boolean;
  yes: boolean;
  dry: boolean;
  print: boolean;
  allowDirty: boolean;
}

/**
 * The default revision. `minor` stays inside the current major, so the command
 * never crosses a breaking boundary without being asked to.
 */
const defaultRevision = "minor";

export const parseArguments = (argv: string[]): ParsedCommand => {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "V" },
      yes: { type: "boolean", short: "y" },
      json: { type: "boolean" },
      dry: { type: "boolean" },
      print: { type: "boolean" },
      "allow-dirty": { type: "boolean" },
      from: { type: "string" },
      to: { type: "string" },
      path: { type: "string" },
    },
  });

  const flags = {
    json: values.json === true,
    yes: values.yes === true,
    dry: values.dry === true,
    print: values.print === true,
    allowDirty: values["allow-dirty"] === true,
  };

  const [first, second] = positionals;

  if (values.version === true) {
    return { command: "version", ...flags };
  }
  if (values.help === true || first === undefined) {
    return { command: "help", ...flags };
  }
  if (first === "upgrade") {
    return {
      command: "upgrade",
      revision: second ?? defaultRevision,
      path: values.path,
      ...flags,
    };
  }
  if (first === "list") {
    return { command: "list", from: values.from, to: values.to, ...flags };
  }

  return {
    command: "codemod",
    id: first,
    path: second ?? values.path,
    ...flags,
  };
};
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/args.test.ts`
Expected: PASS — 10 tests.

- [ ] **Step 5: Add the emit config**

Create `packages/codemods/tsconfig.build.json`:

```json
{
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "rootDir": "src"
  },
  "exclude": ["src/tests/**/*.ts", "src/transforms/**/*.ts"],
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts"]
}
```

The transforms are **excluded from the emit on purpose**: jscodeshift runs them
through its own babel pipeline, so they ship as `.ts` and must not be compiled.
They stay covered by the `tsc --noEmit` gate in `tsconfig.json`.

- [ ] **Step 6: Write the CLI entry point**

Create `packages/codemods/src/cli.ts`:

```ts
#!/usr/bin/env node
import { parseArguments } from "./cli/args";

const usage = `flow-codemods — migrate a codebase across Flow versions

Usage:
  flow-codemods upgrade [revision]   Bump every Flow dependency, install, run codemods
  flow-codemods <id> [path]          Run a single codemod
  flow-codemods list                 Show the migrations for a version range

Revision: patch | minor | major | a dist-tag (latest, next) | an exact version.
Default is minor, which stays inside the current major.

Options:
  -y, --yes          Accept every default. Implied when stdin is not a TTY.
      --allow-dirty  Run even though the working tree has uncommitted changes
      --dry          Do not write files
      --print        Print the transformed output
      --path         Sources to transform
      --from, --to   Bound the range for "list"
      --json         Machine-readable output for "list"
  -h, --help         Show this text
  -V, --version      Show the version
`;

const main = async (): Promise<number> => {
  const parsed = parseArguments(process.argv.slice(2));

  switch (parsed.command) {
    case "help":
      process.stdout.write(usage);
      return 0;
    case "version": {
      const { default: manifest } = await import("../package.json", {
        with: { type: "json" },
      });
      process.stdout.write(`${manifest.version}\n`);
      return 0;
    }
    default:
      process.stderr.write(`"${parsed.command}" is not implemented yet\n`);
      return 1;
  }
};

main().then(
  (code) => process.exit(code),
  (error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  },
);
```

`../package.json` resolves from `dist/cli.js` to the package root at run time,
and from `src/cli.ts` during the `tsc --noEmit` gate.

- [ ] **Step 7: Make the package publishable**

Replace `packages/codemods/package.json` with:

```json
{
  "bin": {
    "flow-codemods": "dist/cli.js"
  },
  "dependencies": {
    "@inquirer/prompts": "^7.9.0",
    "jscodeshift": "^17.3.0",
    "semver": "^7.8.5"
  },
  "devDependencies": {
    "@types/jscodeshift": "^17.3.0",
    "@types/node": "^25.9.3",
    "@types/semver": "^7.7.3",
    "prettier": "^3.9.6",
    "tsx": "^4.23.12",
    "typescript": "^6.0.3",
    "vitest": "^4.1.11",
    "yaml": "^2.8.1"
  },
  "files": ["dist", "src", "*.md"],
  "name": "@mittwald/flow-codemods",
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "test:compile": "tsc --noEmit",
    "test:unit": "vitest run"
  },
  "type": "module"
}
```

**Leave `version` exactly as it is** — it is not in the block above because
Lerna owns it. Every package shares one number and it moves on release (the repo
is on `1.0.2` at the time of writing). Do not hardcode it and do not reorder the
existing keys beyond what Prettier does.

Three changes beyond the obvious. `private: true` is gone. `jscodeshift` moves
from `peerDependencies` to `dependencies`, because an `npx` run has to bring its
own. And `files` ships all of `src`, not just `src/transforms`, so a transform
that later grows a shared import still resolves.

`build` only emits `dist` here; Task 2 puts the catalogue generator in front of
it. There is no bundler to keep — Task 0 deliberately left it behind.

Add `resolveJsonModule` to `packages/codemods/tsconfig.json`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "rootDir": "${configDir}"
  },
  "extends": "../typescript-config/library.json",
  "include": ["src/**/*.ts", "dev/**/*.ts", "vitest.config.ts"]
}
```

- [ ] **Step 8: Install the new dependencies**

Run: `pnpm install` Expected: lockfile updated, no
`ERR_PNPM_NO_MATCHING_VERSION`. If a version is rejected, `minimumReleaseAge` is
blocking it — drop to the previous published minor.

- [ ] **Step 9: Write the failing smoke test for the built binary**

Create `packages/codemods/src/tests/bin.test.ts`:

```ts
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
```

- [ ] **Step 10: Build and run the whole suite**

Run: `pnpm nx build codemods && pnpm nx test:unit codemods` Expected: PASS — the
2 `bin` tests, the 10 `args` tests, and the existing 74.

Run: `head -1 packages/codemods/dist/cli.js` Expected: `#!/usr/bin/env node` —
confirm `tsc` preserved the shebang. If it did not, the `bin` is unusable; add
the shebang in a post-build step rather than shipping a broken binary.

- [ ] **Step 11: Commit**

```bash
git add packages/codemods/package.json packages/codemods/tsconfig.json \
  packages/codemods/tsconfig.build.json packages/codemods/src/cli.ts \
  packages/codemods/src/cli/args.ts packages/codemods/src/tests/args.test.ts \
  packages/codemods/src/tests/bin.test.ts pnpm-lock.yaml
git commit -m "feat(codemods): publish the package with a CLI entry point"
```

---

## Task 2: The migration catalogue — schema, reader, generated module

**Files:**

- Create: `packages/codemods/src/catalog/types.ts`
- Create: `packages/codemods/src/catalog/read.ts`
- Create: `packages/codemods/src/catalog/entries.ts`
- Create: `packages/codemods/dev/generate/migrationsModule.ts`
- Create: `packages/codemods/dev/generateCli.ts`
- Create: `packages/codemods/src/migrations/align-to-combine.md`
- Create: `packages/codemods/src/migrations/renamed-css-export.md`
- Create: `packages/codemods/src/tests/catalog.test.ts`
- Modify: `packages/codemods/package.json` (`build` → `dev/generateCli.ts`)
- Rename: `packages/codemods/src/transforms/flowAlphaAlignToCombine.ts` →
  `align-to-combine.ts`

**Interfaces:**

- Consumes: nothing from Task 1.
- Produces: `MigrationEntry`, `MigrationKind`, `MigrationAction`
  (`src/catalog/types.ts`); `readCatalog(): MigrationEntry[]`
  (`src/catalog/read.ts`, build time only); `CatalogEntry` and
  `allEntries: CatalogEntry[]` (`src/catalog/entries.ts`, run time). Tasks 5,
  10, 11, 12 consume `allEntries`.

Two entries are authored here as proof of the schema — one with a codemod, one
without. The other 19 follow in Task 3.

- [ ] **Step 1: Write the type**

Create `packages/codemods/src/catalog/types.ts`:

```ts
/**
 * When an entry applies.
 *
 * - `migration` — the old path is gone, at runtime or in the types. It only
 *   matters when the consumer actually crosses `since`.
 * - `deprecation` — the old path still works. It matters as soon as the
 *   replacement exists, so `since` is the version that introduced the
 *   replacement, not one that removed anything.
 */
export type MigrationKind = "migration" | "deprecation";

/**
 * What has to happen.
 *
 * - `codemod` — `src/transforms/<id>.ts` does it.
 * - `manual` — a person or an agent has to change code.
 * - `none` — behaviour changed, no code change required. An agent needs this
 *   spelled out, or it keeps looking for something to edit.
 */
export type MigrationAction = "codemod" | "manual" | "none";

export interface MigrationEntry {
  /**
   * Dashed and lowercase. Doubles as the `src/transforms/<id>.ts` file name
   * when `action` is `codemod`, and as the `MIGRATION.md` heading anchor.
   */
  id: string;
  /** The exact version the change shipped in. */
  since: string;
  /** Heading text for the guide. */
  title: string;
  kind: MigrationKind;
  action: MigrationAction;
  /**
   * Whether the entry also applies to `@mittwald/flow-remote-react-components`.
   * Held to that package's real export surface by `remoteScope.test.ts` — do
   * not guess it.
   */
  remotePackage: boolean;
  /**
   * A shell command that finds affected code. May over-match — the reader looks
   * at the hits. Must not under-match. Omitted only when `action` is `none`.
   */
  detect?: string;
  /** What to change, imperative and specific enough to execute. */
  apply: string;
  /** How to confirm it landed. */
  verify: string;
  /** The guide entry as Markdown. Headings inside it start at level 4. */
  body: string;
}
```

- [ ] **Step 2: Write the failing test for the reader**

Create `packages/codemods/src/tests/catalog.test.ts`:

```ts
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { readCatalog } from "../catalog/read";

const catalog = readCatalog();
const byId = new Map(catalog.map((entry) => [entry.id, entry]));

const hasTransform = (id: string): boolean =>
  existsSync(fileURLToPath(new URL(`../transforms/${id}.ts`, import.meta.url)));

describe("the catalogue reads and validates", () => {
  test("it is not empty", () => {
    expect(catalog.length).toBeGreaterThan(0);
  });

  test("an entry with a codemod carries its structured fields", () => {
    expect(byId.get("align-to-combine")).toMatchObject({
      id: "align-to-combine",
      since: "0.2.0-alpha.1047",
      kind: "migration",
      action: "codemod",
      remotePackage: true,
    });
  });

  test("an entry without a codemod is marked manual", () => {
    expect(byId.get("renamed-css-export")).toMatchObject({ action: "manual" });
  });

  test("the body is Markdown, not frontmatter", () => {
    const entry = byId.get("align-to-combine");
    expect(entry?.body).not.toMatch(/^---/);
    expect(entry?.body.length).toBeGreaterThan(0);
  });
});

describe("catalogue invariants", () => {
  test("every id is dashed and lowercase", () => {
    const bad = catalog
      .map((entry) => entry.id)
      .filter((id) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id));
    expect(bad).toEqual([]);
  });

  test("every id is unique", () => {
    const ids = catalog.map((entry) => entry.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  test("action codemod means a transform exists, and a transform means codemod", () => {
    const mismatched = catalog.filter(
      (entry) => hasTransform(entry.id) !== (entry.action === "codemod"),
    );
    expect(mismatched.map((entry) => entry.id)).toEqual([]);
  });

  test("only action none may omit detect", () => {
    const missing = catalog.filter(
      (entry) => entry.detect === undefined && entry.action !== "none",
    );
    expect(missing.map((entry) => entry.id)).toEqual([]);
  });

  test("kind and action only take known values", () => {
    const kinds = new Set(["migration", "deprecation"]);
    const actions = new Set(["codemod", "manual", "none"]);
    const bad = catalog.filter(
      (entry) => !kinds.has(entry.kind) || !actions.has(entry.action),
    );
    expect(bad.map((entry) => entry.id)).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/catalog.test.ts`
Expected: FAIL — `Failed to resolve import "../catalog/read"`.

- [ ] **Step 4a: Keep the reader out of `dist`**

`src/catalog/read.ts` imports `yaml`, which is a **devDependency** — it parses
frontmatter for the generators and is never used at run time. Emitting it into
`dist` would ship a module whose import a consumer cannot resolve. Add it to
`tsconfig.build.json`'s `exclude`, next to the tests and the transforms:

```json
"exclude": [
  "src/tests/**/*.ts",
  "src/transforms/**/*.ts",
  "src/catalog/read.ts"
]
```

It stays covered by the `tsc --noEmit` gate in `tsconfig.json`.

- [ ] **Step 4: Implement the reader**

Create `packages/codemods/src/catalog/read.ts`:

```ts
import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import type { MigrationEntry } from "./types";

const migrationsDir = fileURLToPath(new URL("../migrations", import.meta.url));

/** Frontmatter delimited by `---` lines, then the Markdown body. */
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

const requiredStrings = ["since", "title", "kind", "action", "apply", "verify"];

const parseEntry = (file: string, source: string): MigrationEntry => {
  // A function declaration, not an arrow: only that form narrows control flow
  // after the call, so the checks below do not need a redundant `throw`. The
  // bundler this package used to ship had the same note for the same reason.
  function fail(message: string): never {
    throw new Error(`${basename(file)}: ${message}`);
  }

  const match = frontmatterPattern.exec(source);
  if (!match) {
    fail("has no `---` frontmatter block");
  }

  const [, frontmatter = "", body = ""] = match;
  const data = parse(frontmatter) as Record<string, unknown>;

  for (const key of requiredStrings) {
    if (typeof data[key] !== "string" || data[key] === "") {
      fail(`is missing the required string field \`${key}\``);
    }
  }
  if (typeof data.remotePackage !== "boolean") {
    fail("is missing the required boolean field `remotePackage`");
  }
  if (data.detect !== undefined && typeof data.detect !== "string") {
    fail("has a non-string `detect`");
  }

  return {
    id: basename(file, ".md"),
    since: data.since as string,
    title: data.title as string,
    kind: data.kind as MigrationEntry["kind"],
    action: data.action as MigrationEntry["action"],
    remotePackage: data.remotePackage,
    detect: data.detect as string | undefined,
    apply: data.apply as string,
    verify: data.verify as string,
    body: body.trim(),
  };
};

/**
 * Every catalogue entry, unordered.
 *
 * Build time only: it reads `src/migrations`, which the published package ships
 * but the CLI never parses. The CLI imports `catalog/entries` instead.
 *
 * Callers that need an order sort by `since` with `semver` — a string sort puts
 * `alpha.712` after `alpha.1046`, which is wrong. Task 5 adds that helper.
 */
export const readCatalog = (): MigrationEntry[] =>
  readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const path = join(migrationsDir, file);
      return parseEntry(path, readFileSync(path, "utf8"));
    });
```

- [ ] **Step 5: Author the two proof entries**

Create `packages/codemods/src/migrations/align-to-combine.md`:

````markdown
---
since: 0.2.0-alpha.1047
title: Align renamed to Combine
kind: migration
action: codemod
remotePackage: true
detect: rg -t ts '\bAlign(Props)?\b'
apply:
  Rename `Align` to `Combine` and `AlignProps` to `CombineProps`, for named,
  aliased and namespace imports from a Flow package.
verify: tsc --noEmit passes, and `rg '\bAlign\b'` finds no Flow import.
---

`Align` is now `Combine`. The props type follows: `AlignProps` is
`CombineProps`. An import under a local alias keeps its alias — only the
imported name changes.

```diff
- import { Align } from "@mittwald/flow-react-components";
+ import { Combine } from "@mittwald/flow-react-components";
```
````

Create `packages/codemods/src/migrations/renamed-css-export.md`:

````markdown
---
since: 0.1.0-alpha.292
title: Renamed CSS export
kind: migration
action: manual
remotePackage: false
detect: rg 'flow-react-components/styles'
apply:
  Replace the import `@mittwald/flow-react-components/styles` with
  `@mittwald/flow-react-components/all.css`.
verify:
  The bundle builds and the stylesheet is present; `rg
  'flow-react-components/styles'` finds nothing.
---

The CSS export `@mittwald/flow-react-components/styles` is now
`@mittwald/flow-react-components/all.css` — the file holds the CSS of all
components, and there are per-component CSS exports as well.

```diff
- import "@mittwald/flow-react-components/styles";
+ import "@mittwald/flow-react-components/all.css";
```
````

- [ ] **Step 6: Rename the one transform the test now demands**

The `action codemod means a transform exists` invariant fails for
`align-to-combine` until the file matches the id.

```bash
cd packages/codemods
git mv src/transforms/flowAlphaAlignToCombine.ts src/transforms/align-to-combine.ts
```

Update the two places that name it: the transform name string in
`src/tests/transforms.test.ts` and in `src/tests/idempotency.test.ts`. Rename
the exported const inside the file from `flowAlphaAlignToCombineTransform` to
`alignToCombineTransform`.

No composite to regenerate — Task 0 left it behind. The other eight renames
follow in Task 4.

- [ ] **Step 7: Run the test and verify it passes**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/catalog.test.ts`
Expected: PASS — 9 tests.

- [ ] **Step 8: Write the generator**

Create `packages/codemods/dev/generate/migrationsModule.ts`:

```ts
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
import { rcompare } from "semver";
import { readCatalog } from "../../src/catalog/read";

const target = fileURLToPath(
  new URL("../../src/migrations.generated.ts", import.meta.url),
);

/**
 * Emits the catalogue as a typed module.
 *
 * A module rather than JSON so `tsc` compiles it into `dist` like any other
 * file — no JSON copying to get right — and so the frontmatter is type-checked
 * against `MigrationEntry` on every `test:compile`.
 *
 * The body is dropped: it is prose for humans, it is the largest part of the
 * catalogue, and the CLI never prints it. `list` shows `apply` and `verify`.
 */
export const generateMigrationsModule = async (): Promise<void> => {
  // The `id` tie-break is not decoration: several releases carry two entries
  // (`0.2.0-alpha.646`, `.846` and `.1005` each have two), and without it their
  // order falls back to `readdirSync`, whose order Node does not guarantee
  // across platforms. The generated file would then differ between machines and
  // fail CI's `git diff --exit-code`.
  const entries = readCatalog()
    .toSorted((a, b) => rcompare(a.since, b.since) || a.id.localeCompare(b.id))
    .map(({ body: ignoredBody, ...rest }) => rest);

  const source = [
    "// AUTO-GENERATED by `pnpm nx build codemods` — do not edit.",
    "//",
    "// Source: packages/codemods/src/migrations/*.md",
    "",
    'import type { MigrationEntry } from "./catalog/types";',
    "",
    "/** Every migration, newest first. Bodies live in `src/migrations`. */",
    'export const migrations: Omit<MigrationEntry, "body">[] =',
    `  ${JSON.stringify(entries, null, 2)};`,
  ].join("\n");

  const prettierConfig = await resolveConfig(target);
  await writeFile(
    target,
    await format(source, { ...prettierConfig, parser: "typescript" }),
    "utf8",
  );
};
```

- [ ] **Step 9: Write the generator entry point**

Create `packages/codemods/dev/generateCli.ts`:

```ts
import { generateMigrationsModule } from "./generate/migrationsModule";

await generateMigrationsModule();
```

Tasks 3 and 7 add their generators here.

- [ ] **Step 10: Expose the catalogue at run time**

Create `packages/codemods/src/catalog/entries.ts`:

```ts
import { migrations } from "../migrations.generated";
import type { MigrationEntry } from "./types";

/**
 * A catalogue entry as the CLI sees it — no body.
 *
 * This is the only module that imports the generated file, so nothing else
 * depends on how it is shaped.
 */
export type CatalogEntry = Omit<MigrationEntry, "body">;

export const allEntries: CatalogEntry[] = migrations;
```

- [ ] **Step 11: Point the build at the new generator**

In `packages/codemods/package.json`, set:

```json
"build": "tsx dev/generateCli.ts && tsc -p tsconfig.build.json"
```

Run: `pnpm nx build codemods` Expected: `src/migrations.generated.ts` written
with two entries, newest first (`0.2.0-alpha.1047` before `0.1.0-alpha.292`).

Run:
`pnpm nx test:unit codemods && pnpm nx test:compile codemods && pnpm format`
Expected: PASS, no formatting diff left.

- [ ] **Step 12: Commit**

```bash
git add packages/codemods/src/catalog packages/codemods/src/migrations \
  packages/codemods/src/migrations.generated.ts packages/codemods/dev \
  packages/codemods/src/tests packages/codemods/src/transforms \
  packages/codemods/src/composites packages/codemods/package.json
git commit -m "feat(codemods): add the migration catalogue and its generated module"
```

---

## Task 3: Author the remaining 20 entries and generate `MIGRATION.md`

**Files:**

- Create: 20 files under `packages/codemods/src/migrations/`
- Create: `packages/codemods/dev/generate/migrationGuide.ts`
- Create: `packages/codemods/src/tests/guide.test.ts`
- Modify: `packages/codemods/dev/generateCli.ts`
- Modify: `packages/components/MIGRATION.md` (becomes generated)
- Modify: `packages/codemods/src/tests/documented.test.ts` (rewritten against
  the catalogue)

**Interfaces:**

- Consumes: `readCatalog()` and `MigrationEntry` from Task 2.
- Produces: `generateMigrationGuide(): Promise<void>`; a complete 22-entry
  catalogue that Tasks 5, 10 and 12 select from.

**This task commits with a red suite, deliberately.** Two invariants are
bidirectional — `catalog.test.ts`'s `action: codemod` ⟺ transform-file check,
and `remoteScope.test.ts`'s "every transform is listed" — so neither authoring
the entries first nor renaming the transforms first is green on its own. The
maintainer decided to accept the red commit here rather than merge this task
with Task 4. Expect exactly **eight** failures at Step 10 — the seven
`flowAlpha*` transforms plus `flow020.ts`, whose catalogue id is
`imports-to-package-root`. No others. Task 4 makes it green.

**The catalogue has 22 entries**, derived from the current guide: 21 `###`
headings, minus `Use Codemod` and `Do it manually` (which are subsections of the
`0.1.0 → 0.2.0` entry, not entries), plus that section itself. `since` is always
the `>=` bound of the entry's `## From version …` heading.

Full mapping — author one file per row as `src/migrations/<id>.md`:

| id                                            | since              | title (current heading)                                                                                            | kind        | action  |
| --------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------- | ------- |
| `segmented-control-deprecated`                | `0.2.0-alpha.1056` | SegmentedControl deprecated                                                                                        | deprecation | manual  |
| `align-to-combine`                            | `0.2.0-alpha.1047` | Align renamed to Combine                                                                                           | migration   | codemod |
| `button-color-accent-to-success`              | `0.2.0-alpha.1046` | Button: color `accent` renamed to `success`                                                                        | migration   | codemod |
| `tooltip-trigger-delay-type`                  | `0.2.0-alpha.1016` | TooltipTrigger changed delay type                                                                                  | migration   | manual  |
| `modal-unsaved-changes-confirmation`          | `0.2.0-alpha.1005` | Closing a Modal with unsaved changes is confirmed by default                                                       | migration   | none    |
| `flags-to-component-defaults-provider`        | `0.2.0-alpha.1005` | `flags` is replaced by the ComponentDefaultsProvider                                                               | deprecation | manual  |
| `table-column-width-props`                    | `0.2.0-alpha.956`  | TableColumn: `maxWidth` removed, `width` and `minWidth` retyped                                                    | migration   | manual  |
| `table-render-prop-removed`                   | `0.2.0-alpha.866`  | Table: `render` prop removed                                                                                       | migration   | manual  |
| `table-cell-render-prop-removed`              | `0.2.0-alpha.846`  | TableCell: `render` prop removed                                                                                   | migration   | manual  |
| `color-primary-to-default`                    | `0.2.0-alpha.846`  | Breadcrumb, HeaderNavigation, Heading, IllustratedMessage, and Link: color property "primary" renamed to "default" | migration   | codemod |
| `password-tools-rule`                         | `0.2.0-alpha.802`  | password-tools: `AsyncRule` and `SyncRule` replaced by `Rule`                                                      | migration   | codemod |
| `cartesian-chart-restructured`                | `0.2.0-alpha.780`  | CartesianChart                                                                                                     | migration   | manual  |
| `accent-box-color-to-background-color`        | `0.2.0-alpha.786`  | AccentBox.color is now a declaration for foreground                                                                | migration   | codemod |
| `code-block-syntax-highlighter-removed`       | `0.2.0-alpha.756`  | Removed the underlying react-syntax-highlighter library from CodeBlock                                             | migration   | manual  |
| `muted-action-error-to-abort-action-error`    | `0.2.0-alpha.712`  | `MutedActionError` renamed to `AbortActionError`                                                                   | migration   | codemod |
| `form-resets-after-modal-close`               | `0.2.0-alpha.694`  | Form: resets itself after the surrounding modal closes                                                             | migration   | none    |
| `overlay-controller-add-on-close-return-type` | `0.2.0-alpha.696`  | OverlayController.addOnClose / addOnOpen return type changed                                                       | migration   | manual  |
| `cartesian-chart-empty-view`                  | `0.2.0-alpha.676`  | CartesianChart.emptyView changed                                                                                   | migration   | manual  |
| `action-prop-to-on-action`                    | `0.2.0-alpha.646`  | Action: `action` renamed to `onAction`                                                                             | migration   | codemod |
| `button-props-interfaces`                     | `0.2.0-alpha.646`  | Removed ResetButton and SubmitButton Interfaces                                                                    | migration   | codemod |
| `imports-to-package-root`                     | `0.2.0-alpha.28`   | From version 0.1.0 to version 0.2.0                                                                                | migration   | codemod |
| `renamed-css-export`                          | `0.1.0-alpha.292`  | Renamed CSS export                                                                                                 | migration   | manual  |

Notes that are easy to get wrong:

- **`accent-box-color-to-background-color` sorts above
  `cartesian-chart-restructured`** (`alpha.786` > `alpha.780`) even though the
  current guide lists the CartesianChart section first. The guide's order is
  correct today because sections are ordered by their _from_ bound; the
  catalogue orders by `since`. Do not "fix" the resulting reordering.
- **`imports-to-package-root`'s `since` is `0.2.0-alpha.28`, not `0.2.0`.** The
  guide's heading says "From version 0.1.0 to version 0.2.0", but **neither
  `0.1.0` nor `0.2.0` was ever published** — the only stable releases are
  `1.0.0` and up; everything before was a prerelease. Those headings name
  _lines_, not versions. Writing `0.2.0` is wrong twice over: semver puts
  `0.2.0` _above_ every `0.2.0-alpha.*`, so the oldest migration would sort as
  the newest, and the gate would stop selecting the alpha migrations for anyone
  coming from the `0.1.0` line. `alpha.28` is where the subpath exports actually
  collapsed onto the package root — `alpha.27` still publishes 94 subpath
  entries, `alpha.28` publishes the 7 flat ones.
- **`kind: deprecation` for two entries only** — `segmented-control-deprecated`
  and `flags-to-component-defaults-provider`. Both old paths still work and warn
  via `useWarnDeprecation`. Everything else removed something.
- **`action: none` for two entries** — both are behaviour changes. Their `apply`
  says what to do to _keep the old behaviour_, and states plainly that no change
  is required otherwise.
- **`remotePackage` is not in the table on purpose.** Set your best guess, then
  let `remoteScope.test.ts` correct you (Step 4). It reads the remote package's
  real export surface; a guess that contradicts it is a test failure, which is
  the point.
- Copy each `body` from the current guide verbatim, demoting its headings by one
  level (`###` → `####`). Keep every code example. Drop only the
  `## Benefits of This Change` section of the `0.1.0 → 0.2.0` entry — it is
  marketing prose with no migration content, which the repo's writing style
  rules exclude.

- [ ] **Step 1: Author all 20 remaining entry files**

One `src/migrations/<id>.md` per row, in the frontmatter shape from Task 2
Step 5. Every entry needs `detect`, `apply` and `verify` filled with something
true — these are what an agent acts on.

**Run every `detect` command you write before committing it.** A command that
errors matches nothing, which is the worst failure this schema has: an agent
concludes the migration does not apply. One real example, caught in review of
Task 2: `rg -t ts -t tsx …` fails with `unrecognized file type: tsx` — ripgrep
has no `tsx` type, because `ts` already covers `*.ts`, `*.tsx`, `*.cts` and
`*.mts`. Use `rg -t ts` alone.

For `action: manual` entries, `verify` is usually `tsc --noEmit passes` plus a
`rg` that finds nothing, because every one of these is type-visible. For
`action: none`, omit `detect` and say so in `apply`, for example:

```yaml
apply:
  No code change required. To keep the old behaviour, set
  `Modal.confirmUnsavedChanges` to `false` via `ComponentDefaultsProvider`.
verify: Nothing to verify — the change is in Flow's own behaviour.
```

- [ ] **Step 2: Run the catalogue invariants**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/catalog.test.ts`
Expected: FAIL on `action codemod means a transform exists` for the eight
transforms still carrying their old names (seven `flowAlpha*` plus `flow020`).
That failure is Task 4's job — for now confirm the failure list is exactly those
seven ids and nothing else, which proves every other entry is consistent.

- [ ] **Step 3: Point `remoteScope.test.ts` at the catalogue**

Replace its hand-maintained list of transform targets with a read of the
catalogue: for each entry, its declared `remotePackage` must match whether any
of its targets is reachable in `@mittwald/flow-remote-react-components`. Keep
`remoteScope.ts` untouched — it computes the 317-name surface and is the
authority.

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/remoteScope.test.ts`
Expected: FAIL for every entry whose `remotePackage` you guessed wrong. Fix the
frontmatter, not the test.

- [ ] **Step 4: Write the failing test for the guide generator**

Create `packages/codemods/src/tests/guide.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { readCatalog } from "../catalog/read";
import { renderMigrationGuide } from "../../dev/generate/migrationGuide";

const committed = readFileSync(
  fileURLToPath(new URL("../../../components/MIGRATION.md", import.meta.url)),
  "utf8",
);

describe("the generated migration guide", () => {
  test("the committed file matches the catalogue", async () => {
    expect(await renderMigrationGuide()).toBe(committed);
  });

  test("every entry has an anchor matching its id", () => {
    for (const entry of readCatalog()) {
      expect(committed).toContain(`<a id="${entry.id}"></a>`);
    }
  });

  test("entries appear newest first", () => {
    const order = [...committed.matchAll(/<a id="([a-z0-9-]+)"><\/a>/g)].map(
      (match) => match[1],
    );
    expect(order[0]).toBe("segmented-control-deprecated");
    expect(order.at(-1)).toBe("renamed-css-export");
  });
});
```

- [ ] **Step 5: Run it and verify it fails**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/guide.test.ts`
Expected: FAIL — `Failed to resolve import "../../dev/generate/migrationGuide"`.

This suite stays red until Step 8 writes the file: the first test compares the
generator's output against the committed `MIGRATION.md`, which is still the
hand-written one until then. That is the intended sequence — do not chase it
green before Step 8.

- [ ] **Step 6: Implement the guide generator**

Create `packages/codemods/dev/generate/migrationGuide.ts`:

```ts
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
import { rcompare } from "semver";
import { readCatalog } from "../../src/catalog/read";
import type { MigrationEntry } from "../../src/catalog/types";

const target = fileURLToPath(
  new URL("../../../components/MIGRATION.md", import.meta.url),
);

const intro = `# Migrations

<!-- AUTO-GENERATED by \`pnpm nx build codemods\` — do not edit.
     Source: packages/codemods/src/migrations/*.md -->

Entries are sorted by version, newest first. Find the version you are coming
from and work your way up.

Catching up across several versions? One command bumps every Flow dependency and
runs exactly the codemods the range needs:

\`\`\`shell
npx @mittwald/flow-codemods@latest upgrade
\`\`\`

It is not the whole migration. Most entries below have no codemod and have to be
done by hand — the command prints those for your range when it is done.
`;

const remoteNote = "also applies to `@mittwald/flow-remote-react-components`";

const renderEntry = (entry: MigrationEntry): string => {
  const facts = [
    `**Since \`${entry.since}\`**`,
    entry.kind,
    entry.action === "codemod"
      ? "codemod available"
      : entry.action === "manual"
        ? "manual change"
        : "no code change needed",
    entry.remotePackage ? remoteNote : undefined,
  ].filter((fact) => fact !== undefined);

  const invocation =
    entry.action === "codemod"
      ? `\`\`\`shell\nnpx @mittwald/flow-codemods@latest ${entry.id} src\n\`\`\`\n`
      : "";

  return [
    `<a id="${entry.id}"></a>`,
    "",
    `## ${entry.title}`,
    "",
    facts.join(" · "),
    "",
    entry.body,
    "",
    `**Apply:** ${entry.apply}`,
    "",
    `**Verify:** ${entry.verify}`,
    "",
    invocation,
  ].join("\n");
};

/** The guide as source, so a test can compare without writing anything. */
export const renderMigrationGuide = async (): Promise<string> => {
  // No `kind` filter yet: `"tool"` does not exist until Task 4, which adds it
  // together with the filter that excludes it from the guide.
  const entries = readCatalog()
    // Same `id` tie-break as the generated module, and for the same reason:
    // duplicate `since` values would otherwise order by directory listing.
    .toSorted((a, b) => rcompare(a.since, b.since) || a.id.localeCompare(b.id));

  const markdown = [intro, ...entries.map(renderEntry)].join("\n---\n\n");

  const prettierConfig = await resolveConfig(target);
  return format(markdown, { ...prettierConfig, parser: "markdown" });
};

export const generateMigrationGuide = async (): Promise<void> => {
  await writeFile(target, await renderMigrationGuide(), "utf8");
};
```

Running the output through Prettier with the repo config is what makes the test
a stable equality check — otherwise `format:check` and the generator disagree on
line wrapping and the file never settles.

- [ ] **Step 7: Wire it into the generator entry point**

`packages/codemods/dev/generateCli.ts`:

```ts
import { generateMigrationGuide } from "./generate/migrationGuide";
import { generateMigrationsModule } from "./generate/migrationsModule";

await generateMigrationsModule();
await generateMigrationGuide();
```

- [ ] **Step 8: Generate and compare**

Run: `pnpm nx build codemods` Expected: `packages/components/MIGRATION.md`
rewritten.

Run: `git diff packages/components/MIGRATION.md` **Read this diff carefully.**
Every removal must be either a heading level change, the reordering noted above,
the dropped "Benefits of This Change" section, or the retired URL invocations. A
dropped code example or a dropped paragraph means a `body` was not copied over —
fix the entry, do not accept the diff.

- [ ] **Step 9: Rewrite `documented.test.ts`**

Its job changes. It no longer scans guides for URL patterns; it asserts the
catalogue and the shipped transforms agree, which the catalogue invariants in
Task 2 already cover. Keep one thing it did that nothing else does: that the
`apps/docs` versioning page does not name a transform that no longer exists.

```ts
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { allEntries } from "../catalog/entries";

const versioningPage = readFileSync(
  fileURLToPath(
    new URL(
      "../../../../apps/docs/src/content/01-get-started/versioning/index.mdx",
      import.meta.url,
    ),
  ),
  "utf8",
);

describe("the docs site and the catalogue agree", () => {
  test("every codemod id the versioning page names exists", () => {
    // The page also shows `upgrade` and `list`; those are commands, not ids.
    const commands = new Set(["upgrade", "list"]);
    const named = [
      ...versioningPage.matchAll(/flow-codemods@latest ([a-z0-9-]+)/g),
    ]
      .map((match) => match[1] as string)
      .filter((name) => !commands.has(name));
    const ids = new Set(allEntries.map((entry) => entry.id));
    expect(named.filter((id) => !ids.has(id))).toEqual([]);
  });
});
```

- [ ] **Step 10: Run the whole suite**

Run:
`pnpm nx build codemods && pnpm nx test:unit codemods && pnpm nx test:compile codemods`
Expected: only the eight transform-name failures from Step 2 remain. Everything
else passes.

- [ ] **Step 11: Commit**

```bash
git add packages/codemods/src/migrations packages/codemods/dev \
  packages/codemods/src/migrations.generated.ts packages/codemods/src/tests \
  packages/components/MIGRATION.md
git commit -m "feat(codemods): generate MIGRATION.md from the catalogue"
```

---

## Task 4: Rename the transforms to their catalogue ids

**Files:**

- Rename: 8 files in `packages/codemods/src/transforms/` (the ninth,
  `align-to-combine.ts`, was renamed in Task 2)
- Modify: `packages/codemods/src/tests/runTransform.ts`
- Create: `packages/codemods/src/migrations/to-remote-package.md`
- Modify: `packages/codemods/src/catalog/types.ts` (add `"tool"` to
  `MigrationKind`)
- Modify: `packages/codemods/src/tests/transforms.test.ts`,
  `src/tests/idempotency.test.ts`,
  `src/tests/flowAlphaAccentBoxColorToBackgroundColor.test.ts`
- Modify: `packages/codemods/package.json`, `project.json`

**Interfaces:**

- Consumes: the catalogue from Task 3.
- Produces: `src/transforms/<id>.ts` for all nine codemods, named exactly as
  their catalogue id. Task 9 resolves transforms by that name.

- [ ] **Step 1: Rename the eight remaining transforms**

```bash
cd packages/codemods/src/transforms
git mv flowAlphaAccentBoxColorToBackgroundColor.ts accent-box-color-to-background-color.ts
git mv flowAlphaActionPropToOnAction.ts action-prop-to-on-action.ts
git mv flowAlphaButtonColorAccentToSuccess.ts button-color-accent-to-success.ts
git mv flowAlphaButtonPropsInterfaces.ts button-props-interfaces.ts
git mv flowAlphaColorPrimaryToDefault.ts color-primary-to-default.ts
git mv flowAlphaMutedActionErrorToAbortActionError.ts muted-action-error-to-abort-action-error.ts
git mv flowAlphaPasswordToolsRule.ts password-tools-rule.ts
git mv flow020.ts imports-to-package-root.ts
git mv flowRemote.ts to-remote-package.ts
```

Rename each file's internal const to match —
`flowAlphaPasswordToolsRuleTransform` → `passwordToolsRuleTransform`, and so on.
The `export default` identifier must still be the declaration's own name.

Rename the fixture test file too:

```bash
cd packages/codemods/src/tests
git mv flowAlphaAccentBoxColorToBackgroundColor.test.ts accent-box-color-to-background-color.test.ts
```

- [ ] **Step 2: Update every transform name string in the tests**

`transforms.test.ts` and `idempotency.test.ts` pass transform names to
`runTransform`. Replace all nine.

- [ ] **Step 3: Point `runTransform` at the transform in place**

Task 0 never brought the URL delivery path in, so there is nothing to delete
here. But `runTransform` still copies the transform into a temp directory of its
own to reproduce that path, and its doc comment still explains why. Both are now
misleading: the CLI hands jscodeshift a path inside the installed package.

Change it to run the transform from `src/transforms` directly, keeping the temp
directory for the **input file** only, and replace the comment:

```ts
/**
 * Runs a transform the way the CLI does: the real jscodeshift CLI, over a file
 * in a temp directory, with the transform read from `src/transforms`.
 *
 * Spawning the CLI rather than calling the transform in-process is deliberate —
 * it is the invocation `runCodemod` makes, so a transform that only works when
 * called directly fails here too.
 */
export const runTransform = (name: string, source: string): string => {
  const workingDir = mkdtempSync(join(tmpdir(), "flow-codemods-"));
  const inputFile = join(workingDir, "input.tsx");
  writeFileSync(inputFile, source);

  const output = execFileSync(
    process.execPath,
    [
      jscodeshiftBin,
      "-t",
      join(transformsDir, `${name}.ts`),
      "--parser",
      "tsx",
      inputFile,
    ],
    { cwd: workingDir, stdio: "pipe", encoding: "utf8" },
  );

  assertProcessed(name, output);

  return readFileSync(inputFile, "utf8");
};
```

Drop the now-unused `copyFileSync` import, and simplify `assertProcessed`'s
error message — it currently blames a missing sibling file, which is no longer a
failure mode.

And drop the composite exclusion from `project.json`'s `namedInputs` — there is
no generated transform left to exclude:

```json
{
  "name": "codemods",
  "namedInputs": {
    "codemods-src": [
      "default",
      "{projectRoot}/src/**/*",
      "{projectRoot}/dev/**/*"
    ]
  },
  "projectType": "library",
  "sourceRoot": "packages/codemods/src",
  "targets": {
    "build": {
      "cache": true,
      "inputs": ["codemods-src", "{workspaceRoot}/.prettierrc.json"],
      "outputs": [
        "{projectRoot}/dist",
        "{projectRoot}/src/migrations.generated.ts",
        "{workspaceRoot}/packages/components/MIGRATION.md"
      ]
    },
    "test:unit": {
      "cache": true,
      "dependsOn": ["^build", "build"],
      "inputs": [
        "codemods-src",
        { "dependentTasksOutputFiles": "**/*", "transitive": false }
      ]
    }
  }
}
```

`MIGRATION.md` is an output **outside** this project's root. That is legal via
`{workspaceRoot}`, and it is deliberate — the file has to sit in
`packages/components` to ship in that package's tarball. Task 13 verifies the
caching behaviour; do not skip it.

- [ ] **Step 4: Give `to-remote-package` a catalogue home**

Add `"tool"` to `MigrationKind` in `src/catalog/types.ts`:

```ts
/**
 * When an entry applies.
 *
 * - `migration` — the old path is gone, at runtime or in the types. It only
 *   matters when the consumer actually crosses `since`.
 * - `deprecation` — the old path still works. It matters as soon as the
 *   replacement exists.
 * - `tool` — not a migration at all. Never selected by a version range; it exists
 *   so a codemod that ports code between packages has a documented home instead
 *   of a named exception in a test.
 */
export type MigrationKind = "migration" | "deprecation" | "tool";
```

Create `packages/codemods/src/migrations/to-remote-package.md`:

````markdown
---
since: 0.2.0
title: Port an app to the remote package
kind: tool
action: codemod
remotePackage: false
detect: rg '@mittwald/flow-react-components'
apply:
  Rewrite every `@mittwald/flow-react-components` import to
  `@mittwald/flow-remote-react-components`. Run this only when porting an app
  into an mStudio extension — on a normal app it rewrites every Flow import.
verify: tsc --noEmit passes and the app renders inside the extension host.
---

This is a port, not a migration: it moves an application onto
`@mittwald/flow-remote-react-components` so it can render inside an mStudio
extension. No version range selects it — run it deliberately.

```shell
npx @mittwald/flow-codemods@latest to-remote-package src
```
````

**Now add the filter that uses it.** Task 3 could not write this, because
`"tool"` did not exist as a `MigrationKind` yet. In
`dev/generate/migrationGuide.ts`, restore the filter ahead of the sort:

```ts
const entries = readCatalog()
  .filter((entry) => entry.kind !== "tool")
  .toSorted((a, b) => rcompare(a.since, b.since) || a.id.localeCompare(b.id));
```

Without it, a codemod that ports an app between packages appears in the consumer
migration guide as though it were a migration. Regenerate afterwards and confirm
`to-remote-package` shows up in neither `MIGRATION.md` nor any bounded `list`
output — `kind: "tool"` also keeps it out of the gate in Task 5.

- [ ] **Step 4b: Restore the invariant the `remoteScope` rewrite dropped**

Task 3 repointed `src/tests/remoteScope.test.ts` at the catalogue, which grew
coverage from 9 transforms to 20 entries but silently retired what the test was
originally for. The old version derived `claimsRemote` from
`declaredPackages(name)` — a parse of the transform's own `flowPackages` array —
and checked **the transform's scoping** against what the remote package really
exports. The new version checks **the frontmatter** instead. So a transform that
scopes itself to the remote package without a reachable target no longer fails;
the transform code and the frontmatter became two independently maintained facts
with nothing tying them together. They agree today, so the regression is latent.

It could not be fixed in Task 3 because it needs the renamed files. Add it now:
for every entry with `action: "codemod"`, assert that whether
`declaredPackages(entry.id)` claims `@mittwald/flow-remote-react-components`
equals `entry.remotePackage`. Keep the catalogue-vs-export-surface check too —
the two together are what make `remotePackage` derived rather than declared.

Also restore an equivalent of the old `every transform is listed` test, which
forced every transform file to be accounted for. Nothing does that now:
`catalog.test.ts` iterates the catalogue, so it only notices an orphan transform
whose filename happens to equal a catalogue id. Assert instead that the set of
files in `src/transforms` equals the set of ids with `action: "codemod"`, plus
`to-remote-package`.

- [ ] **Step 5: Build and run everything**

Run:
`pnpm nx build codemods && pnpm nx test:unit codemods && pnpm nx test:compile codemods`
Expected: PASS, all suites green for the first time since Task 2.

Run: `git diff --exit-code` Expected: clean — this is the CI gate for generated
code.

- [ ] **Step 6: Confirm the retired path is really gone**

Run:
`rg -n 'raw.githubusercontent.com/mittwald/flow.*transforms' --glob '!*.lock'`
Expected: only hits inside `apps/docs` (Task 14 rewrites those) — none in
`packages/`.

- [ ] **Step 7: Commit**

```bash
git add -A packages/codemods packages/components/MIGRATION.md
git commit -m "feat(codemods): rename transforms to catalogue ids and retire the URL path"
```

**No `!` marker**, here or in the PR title — see "Why this is not a breaking
change". A breaking marker would route the PR to the major line and the
commit-guard would reject it on `next`.

---

## Task 5: The gate — selecting entries for a version range

**Files:**

- Create: `packages/codemods/src/catalog/select.ts`
- Create: `packages/codemods/src/tests/select.test.ts`

**Interfaces:**

- Consumes: `CatalogEntry` from `src/catalog/entries.ts` (Task 2).
- Produces: `selectEntries(entries, current, target): CatalogEntry[]` and
  `sortBySince(entries): CatalogEntry[]`. Tasks 10 and 12 call `selectEntries`.

This is the heart of the design and it is pure. The two gates differ:

| `kind`        | Gate                        | Why                                                                                                                                                      |
| ------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `migration`   | `current < since <= target` | Only what you actually cross.                                                                                                                            |
| `deprecation` | `since <= target`           | Not bound to a boundary — only to the replacement existing. Whether it applies is decided by the transform, which is a no-op when the old API is absent. |
| `tool`        | never                       | Not a migration.                                                                                                                                         |

- [ ] **Step 1: Write the failing test**

Create `packages/codemods/src/tests/select.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { selectEntries, sortBySince } from "../catalog/select";

const entry = (
  id: string,
  since: string,
  kind: CatalogEntry["kind"] = "migration",
): CatalogEntry => ({
  id,
  since,
  title: id,
  kind,
  action: "codemod",
  remotePackage: false,
  detect: "rg x",
  apply: "do it",
  verify: "tsc --noEmit",
});

const ids = (entries: CatalogEntry[]): string[] =>
  entries.map((selected) => selected.id);

describe("selectEntries", () => {
  test("a migration is selected only when the range crosses it", () => {
    const catalog = [entry("crossed", "0.2.0-alpha.646")];
    expect(ids(selectEntries(catalog, "0.2.0-alpha.640", "1.0.1"))).toEqual([
      "crossed",
    ]);
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([]);
  });

  test("since equal to target is crossed, since equal to current is not", () => {
    const catalog = [entry("edge", "1.1.0")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["edge"]);
    expect(ids(selectEntries(catalog, "1.1.0", "1.2.0"))).toEqual([]);
  });

  test("a deprecation is selected whenever the replacement exists", () => {
    const catalog = [entry("dep", "0.2.0-alpha.1056", "deprecation")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["dep"]);
    expect(ids(selectEntries(catalog, "0.2.0-alpha.900", "1.0.0"))).toEqual([
      "dep",
    ]);
  });

  test("a deprecation whose replacement is not in the target yet is skipped", () => {
    const catalog = [entry("future", "2.0.0", "deprecation")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([]);
  });

  test("a tool is never selected", () => {
    const catalog = [entry("port", "0.2.0", "tool")];
    expect(ids(selectEntries(catalog, "0.1.0", "9.9.9"))).toEqual([]);
  });

  // The bounds straddle a single-to-double-digit boundary on purpose: numeric
  // comparison includes `.10` (9 < 10 <= 11), a string comparison excludes it
  // (`"9" < "10"` is false). Bounds like .700-.800 around .712/.1046 pass under
  // both a correct and a naive string implementation, so they prove nothing.
  test("alpha prereleases compare numerically, not as strings", () => {
    const catalog = [entry("included", "0.2.0-alpha.10")];
    expect(
      ids(selectEntries(catalog, "0.2.0-alpha.9", "0.2.0-alpha.11")),
    ).toEqual(["included"]);
  });

  test("a deprecation whose since equals the target is selected", () => {
    const catalog = [entry("edge", "1.1.0", "deprecation")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["edge"]);
  });

  test("the next line is crossed like any other range", () => {
    const catalog = [entry("n", "1.1.0-next.5")];
    expect(ids(selectEntries(catalog, "1.1.0-next.3", "1.1.0-next.7"))).toEqual(
      ["n"],
    );
  });

  test("results are ordered oldest first, the order the changes shipped", () => {
    const catalog = [
      entry("late", "0.2.0-alpha.1047"),
      entry("early", "0.2.0-alpha.646"),
      entry("middle", "0.2.0-alpha.712"),
    ];
    expect(ids(selectEntries(catalog, "0.2.0-alpha.600", "1.0.0"))).toEqual([
      "early",
      "middle",
      "late",
    ]);
  });
});

describe("sortBySince", () => {
  test("sorts oldest first and does not mutate its input", () => {
    const catalog = [entry("b", "1.1.0"), entry("a", "1.0.0")];
    expect(ids(sortBySince(catalog))).toEqual(["a", "b"]);
    expect(ids(catalog)).toEqual(["b", "a"]);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/select.test.ts`
Expected: FAIL — `Failed to resolve import "../catalog/select"`.

- [ ] **Step 3: Implement the gate**

Create `packages/codemods/src/catalog/select.ts`:

```ts
import { compare, lt, lte } from "semver";
import type { CatalogEntry } from "./entries";

/**
 * Oldest first — the order the changes shipped, which is the order to apply
 * them.
 */
export const sortBySince = (entries: CatalogEntry[]): CatalogEntry[] =>
  entries.toSorted(
    (a, b) => compare(a.since, b.since) || a.id.localeCompare(b.id),
  );

/**
 * The entries that a move from `current` to `target` calls for.
 *
 * The gate is the exact version, not a major/minor/patch granularity: a
 * revision keyword bounds the _target_, and the set falls out of that. So
 * `upgrade patch` — target = highest patch of the current minor — selects
 * exactly the entries of the active minor, and `upgrade minor` selects every
 * entry of the active major.
 */
export const selectEntries = (
  entries: CatalogEntry[],
  current: string,
  target: string,
): CatalogEntry[] =>
  sortBySince(
    // The explicit `: boolean` is what makes the `switch` exhaustive. Without
    // it TypeScript infers the return type, a missing case compiles clean, and
    // a future `MigrationKind` would be silently excluded from every upgrade —
    // never offered, never reported, no error anywhere.
    entries.filter((entry): boolean => {
      switch (entry.kind) {
        case "migration":
          return lt(current, entry.since) && lte(entry.since, target);
        // The old path still works, so there is no boundary to cross — only the
        // replacement has to exist in the target.
        case "deprecation":
          return lte(entry.since, target);
        case "tool":
          return false;
      }
    }),
  );
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/select.test.ts`
Expected: PASS — 9 tests.

- [ ] **Step 5: Commit**

```bash
git add packages/codemods/src/catalog/select.ts packages/codemods/src/tests/select.test.ts
git commit -m "feat(codemods): select catalogue entries for a version range"
```

---

## Task 6: Target resolution

**Files:**

- Create: `packages/codemods/src/resolve/target.ts`
- Create: `packages/codemods/src/resolve/registry.ts`
- Create: `packages/codemods/src/tests/target.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces:
  `resolveTarget({ revision, current, versions, distTags }): string | undefined`
  from `src/resolve/target.ts`;
  `fetchVersions(packageName): Promise<{ versions: string[]; distTags: Record<string, string> }>`
  from `src/resolve/registry.ts`. Task 12 composes them.

The registry query is a separate module so `resolveTarget` stays pure and its
tests need no network.

- [ ] **Step 1: Write the failing test**

Create `packages/codemods/src/tests/target.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { resolveTarget } from "../resolve/target";

/** A registry snapshot shaped like the real one, including a stale tag. */
const versions = [
  "0.2.0-alpha.646",
  "0.2.0-experimental.776",
  "0.2.0",
  "1.0.0",
  "1.0.1",
  "1.0.5",
  "1.1.0-next.3",
  "1.1.0",
  "1.2.0",
  "2.0.0",
  "2.1.0",
];
const distTags = {
  latest: "1.2.0",
  next: "1.1.0-next.3",
  experimental: "0.2.0-experimental.776",
};

const resolve = (revision: string, current = "1.0.1"): string | undefined =>
  resolveTarget({ revision, current, versions, distTags });

describe("resolveTarget", () => {
  test("patch stays on the current minor", () => {
    expect(resolve("patch")).toBe("1.0.5");
  });

  test("minor stays inside the current major", () => {
    expect(resolve("minor")).toBe("1.2.0");
  });

  test("major takes the highest stable version", () => {
    expect(resolve("major")).toBe("2.1.0");
  });

  test("keyword resolution never lands on a prerelease", () => {
    expect(resolve("minor")).not.toContain("-");
    expect(resolve("major")).not.toContain("-");
  });

  test("a dist-tag resolves to whatever it points at, prerelease included", () => {
    expect(resolve("next")).toBe("1.1.0-next.3");
    expect(resolve("latest")).toBe("1.2.0");
  });

  test("an exact version is taken as given", () => {
    expect(resolve("1.1.0")).toBe("1.1.0");
  });

  test("an exact version that was never published is rejected", () => {
    expect(resolve("1.9.9")).toBeUndefined();
  });

  test("an unknown revision is rejected rather than guessed", () => {
    expect(resolve("sideways")).toBeUndefined();
  });

  test("patch from a version whose minor has no newer patch resolves to itself", () => {
    expect(resolve("patch", "1.2.0")).toBe("1.2.0");
  });

  test("a stale dist-tag resolves downwards — the caller has to reject it", () => {
    expect(resolve("experimental")).toBe("0.2.0-experimental.776");
  });

  // The shape most real consumers are on — this project published 983
  // `0.2.0-alpha.*` releases. A prerelease `current` resolves *upward* onto the
  // stable release of the same line, because `0.2.0 > 0.2.0-alpha.646`.
  test("a prerelease current resolves onto the stable release of its own line", () => {
    expect(resolve("patch", "0.2.0-alpha.646")).toBe("0.2.0");
    expect(resolve("minor", "0.2.0-alpha.646")).toBe("0.2.0");
  });

  test("major from a prerelease current reaches the newest stable line", () => {
    expect(resolve("major", "0.2.0-alpha.646")).toBe("2.1.0");
  });
});
```

The last test pins a deliberate split of responsibility: `resolveTarget` answers
"what does this revision mean", not "is it worth doing". Task 12 refuses a
target that is not greater than `current`.

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/target.test.ts`
Expected: FAIL — `Failed to resolve import "../resolve/target"`.

- [ ] **Step 3: Implement target resolution**

Create `packages/codemods/src/resolve/target.ts`:

```ts
import { major, minor, prerelease, rsort, satisfies, valid } from "semver";

export interface ResolveTargetInput {
  /** `patch` | `minor` | `major` | a dist-tag | an exact version. */
  revision: string;
  /** The version the consumer is on. */
  current: string;
  /** Every published version of the anchor package. */
  versions: string[];
  distTags: Record<string, string>;
}

/**
 * The range a revision keyword bounds the target to.
 *
 * `patch` keeps the current minor, `minor` keeps the current major, `major`
 * accepts anything.
 */
const keywordRange = (
  revision: string,
  current: string,
): string | undefined => {
  switch (revision) {
    case "patch":
      return `${major(current)}.${minor(current)}.x`;
    case "minor":
      return `${major(current)}.x`;
    case "major":
      return "*";
    default:
      return undefined;
  }
};

/**
 * What a revision means, as a concrete published version.
 *
 * Returns `undefined` when the revision cannot be resolved — an unknown
 * keyword, an unknown dist-tag, or an exact version that was never published.
 * It does **not** judge whether the result is an upgrade; the caller compares
 * against `current` and refuses a sideways or downward move.
 *
 * Keyword resolution skips prereleases. The `prerelease(...) === null` filter
 * is defence in depth rather than the mechanism: none of the ranges built here
 * embeds a prerelease tag, and node-semver only matches a prerelease when a
 * comparator carries a matching one — so `satisfies` already excludes them. The
 * filter keeps that true if a range shape or an option ever changes. Only an
 * explicit dist-tag or an exact version reaches a `-next.N`, so `upgrade minor`
 * on the stable line never drifts onto the collection branch.
 */
export const resolveTarget = ({
  revision,
  current,
  versions,
  distTags,
}: ResolveTargetInput): string | undefined => {
  const tagged = distTags[revision];
  if (tagged !== undefined) {
    return tagged;
  }

  if (valid(revision) !== null) {
    return versions.includes(revision) ? revision : undefined;
  }

  const range = keywordRange(revision, current);
  if (range === undefined) {
    return undefined;
  }

  const candidates = versions.filter(
    (version) => prerelease(version) === null && satisfies(version, range),
  );

  return rsort(candidates)[0];
};
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/target.test.ts`
Expected: PASS — 10 tests.

- [ ] **Step 5: Implement the registry query**

Create `packages/codemods/src/resolve/registry.ts`:

```ts
import registryUrl from "registry-url";

export interface RegistryVersions {
  versions: string[];
  distTags: Record<string, string>;
}

/** Only the fields this CLI reads out of a packument. */
interface Packument {
  versions?: Record<string, unknown>;
  "dist-tags"?: Record<string, string>;
}

/**
 * The registry that actually serves `@mittwald`, from the consumer's npm
 * config.
 *
 * Hardcoding `registry.npmjs.org` would be wrong for anyone behind a corporate
 * mirror or a scoped private registry — `npm view` works for them because npm
 * reads their `.npmrc`, and a CLI that ignores it would fail or, worse, answer
 * from the wrong source.
 */
const registryFor = (packageName: string): string => {
  const scope = packageName.startsWith("@")
    ? packageName.slice(0, packageName.indexOf("/"))
    : undefined;
  return registryUrl(scope).replace(/\/$/, "");
};

/**
 * Every published version of a package, plus its dist-tags.
 *
 * Uses the abbreviated packument media type: the full document for a package
 * with hundreds of releases is megabytes, and none of it is needed here.
 */
export const fetchVersions = async (
  packageName: string,
): Promise<RegistryVersions> => {
  // One wrapper for every failure, not just the HTTP one: `fetch` itself rejects
  // on DNS failure or no connection, and `json()` rejects on a malformed body.
  // Without this those surface as a bare "fetch failed", which says nothing
  // about what the CLI was trying to do.
  let packument: Packument;
  try {
    const response = await fetch(`${registryFor(packageName)}/${packageName}`, {
      headers: { accept: "application/vnd.npm.install-v1+json" },
    });

    if (!response.ok) {
      throw new Error(`the registry answered ${response.status}`);
    }

    packument = (await response.json()) as Packument;
  } catch (error) {
    throw new Error(
      `Could not read ${packageName} from the npm registry: ${
        error instanceof Error ? error.message : error
      }`,
      { cause: error },
    );
  }

  return {
    versions: Object.keys(packument.versions ?? {}),
    distTags: packument["dist-tags"] ?? {},
  };
};
```

- [ ] **Step 6: Verify the registry query against the real registry once**

Run:

```bash
cd packages/codemods && corepack pnpm tsx -e "
import { fetchVersions } from './src/resolve/registry';
const { versions, distTags } = await fetchVersions('@mittwald/flow-react-components');
console.log(versions.length, 'versions', distTags);
"
```

Expected: a three-digit version count and
`{ latest: '1.0.x', experimental: '0.2.0-experimental.776' }`. There is **no
`next` tag yet** — that is expected, and `upgrade next` must fail with a clear
message rather than a crash (Task 12).

Do not add this as a test. A test that hits the network is flaky and gates CI on
npm's availability.

- [ ] **Step 7: Commit**

```bash
git add packages/codemods/src/resolve packages/codemods/src/tests/target.test.ts
git commit -m "feat(codemods): resolve a revision to a published target version"
```

---

## Task 7: The manifest — finding and rewriting Flow dependencies

**Files:**

- Create: `packages/codemods/src/manifest.ts`
- Create: `packages/codemods/src/flowPackages.generated.ts` (generated)
- Create: `packages/codemods/dev/generate/flowPackages.ts`
- Create: `packages/codemods/src/tests/manifest.test.ts`
- Modify: `packages/codemods/dev/generateCli.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `findFlowDependencies(manifest, flowPackages)`,
  `rewriteRange(range, target)`, `applyTarget(manifest, target, flowPackages)`,
  `detectCurrentVersion(deps, readInstalledVersion)` from `src/manifest.ts`;
  `flowPackages: string[]` from `src/flowPackages.generated.ts`. Task 12
  composes them.

**Why every Flow package moves together, not just the one you asked for:**
`@mittwald/flow-react-components@1.0.1` declares `@mittwald/flow-icons-pro` as a
peer at the **exact** version `1.0.1` — the published form of `workspace:*`.
Bumping one without the other is a peer conflict. Fixed versioning makes
lockstep the only correct behaviour.

- [ ] **Step 1: Generate the package list**

Create `packages/codemods/dev/generate/flowPackages.ts`:

```ts
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const packagesDir = fileURLToPath(new URL("../../../", import.meta.url));
const target = fileURLToPath(
  new URL("../../src/flowPackages.generated.ts", import.meta.url),
);

/**
 * Emits the names of every published workspace package.
 *
 * Derived, not maintained: `upgrade` has to move every Flow-line dependency the
 * consumer has, because they share one version and declare exact peers on each
 * other. A hand-written list would silently miss a new package.
 */
export const generateFlowPackages = async (): Promise<void> => {
  const names = readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const manifestPath = join(packagesDir, entry.name, "package.json");
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
          name?: string;
          private?: boolean | string;
        };
        // `private` is not reliably a boolean here: `packages/core` declares
        // it as the string `"true"`. The repo already handles both — see
        // `.github/scripts/version-contract-lib.mjs`. Checking only `=== true`
        // would put a private package on the list and have `upgrade` try to
        // bump something no consumer can install.
        const isPrivate =
          manifest.private === true || manifest.private === "true";
        return isPrivate || manifest.name === undefined ? [] : [manifest.name];
      } catch {
        return [];
      }
    })
    .toSorted();

  const source = [
    "// AUTO-GENERATED by `pnpm nx build codemods` — do not edit.",
    "//",
    "// Source: the non-private packages of packages/*",
    "",
    "/** Every package published from the Flow monorepo, which all share one version. */",
    `export const flowPackages: string[] = ${JSON.stringify(names, null, 2)};`,
  ].join("\n");

  const prettierConfig = await resolveConfig(target);
  await writeFile(
    target,
    await format(source, { ...prettierConfig, parser: "typescript" }),
    "utf8",
  );
};
```

Add it to `dev/generateCli.ts`:

```ts
import { generateFlowPackages } from "./generate/flowPackages";
import { generateMigrationGuide } from "./generate/migrationGuide";
import { generateMigrationsModule } from "./generate/migrationsModule";

await generateFlowPackages();
await generateMigrationsModule();
await generateMigrationGuide();
```

`@mittwald/flow-codemods` is public as of Task 1, so it would list itself.
Exclude it by name in the filter — the CLI does not upgrade itself; `npx` always
fetches the current one.

Run: `pnpm nx build codemods` Expected: `src/flowPackages.generated.ts` lists
the 12 published packages, without `@mittwald/flow-codemods`.

- [ ] **Step 2: Write the failing test**

Create `packages/codemods/src/tests/manifest.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import {
  applyTarget,
  detectCurrentVersion,
  findFlowDependencies,
  rewriteRange,
} from "../manifest";

const flowPackages = [
  "@mittwald/flow-react-components",
  "@mittwald/flow-icons-pro",
  "@mittwald/ext-bridge",
];

const manifest = {
  name: "consumer",
  dependencies: {
    "@mittwald/flow-react-components": "^1.0.1",
    "@mittwald/flow-icons-pro": "1.0.1",
    react: "^19.2.0",
  },
  devDependencies: { "@mittwald/ext-bridge": "~1.0.1" },
};

describe("findFlowDependencies", () => {
  test("finds Flow packages across dependency fields and ignores others", () => {
    expect(findFlowDependencies(manifest, flowPackages)).toEqual([
      {
        field: "dependencies",
        name: "@mittwald/flow-react-components",
        range: "^1.0.1",
      },
      {
        field: "dependencies",
        name: "@mittwald/flow-icons-pro",
        range: "1.0.1",
      },
      {
        field: "devDependencies",
        name: "@mittwald/ext-bridge",
        range: "~1.0.1",
      },
    ]);
  });

  test("peer and optional dependencies are found too", () => {
    expect(
      findFlowDependencies(
        {
          peerDependencies: { "@mittwald/flow-react-components": "^1.0.1" },
          optionalDependencies: { "@mittwald/flow-icons-pro": "1.0.1" },
        },
        flowPackages,
      ),
    ).toEqual([
      {
        field: "peerDependencies",
        name: "@mittwald/flow-react-components",
        range: "^1.0.1",
      },
      {
        field: "optionalDependencies",
        name: "@mittwald/flow-icons-pro",
        range: "1.0.1",
      },
    ]);
  });

  test("a manifest without Flow dependencies yields nothing", () => {
    expect(
      findFlowDependencies({ dependencies: { react: "^19" } }, flowPackages),
    ).toEqual([]);
  });
});

describe("rewriteRange", () => {
  test("keeps the range operator", () => {
    expect(rewriteRange("^1.0.1", "1.2.0")).toBe("^1.2.0");
    expect(rewriteRange("~1.0.1", "1.2.0")).toBe("~1.2.0");
    expect(rewriteRange(">=1.0.1", "1.2.0")).toBe(">=1.2.0");
  });

  test("an exact pin stays exact", () => {
    expect(rewriteRange("1.0.1", "1.2.0")).toBe("1.2.0");
  });

  test("a range it cannot read is left alone", () => {
    expect(rewriteRange("workspace:*", "1.2.0")).toBe("workspace:*");
    expect(rewriteRange("*", "1.2.0")).toBe("*");
    expect(rewriteRange("latest", "1.2.0")).toBe("latest");
  });

  // The dangerous failure is not "left alone" but "collapsed": a compound or
  // OR range rewritten to a single version would silently narrow what the
  // consumer accepts. Both fail `valid()` on their trailing text, so the whole
  // range is rejected — pin that, because a looser regex would not.
  test("a compound or OR range is never collapsed to one version", () => {
    expect(rewriteRange(">=1.0.0 <2.0.0", "1.2.0")).toBe(">=1.0.0 <2.0.0");
    expect(rewriteRange("1.0.0 || 2.0.0", "1.2.0")).toBe("1.0.0 || 2.0.0");
  });

  test("an x-range is left alone", () => {
    expect(rewriteRange("1.x", "1.2.0")).toBe("1.x");
    expect(rewriteRange("1.2.x", "1.2.0")).toBe("1.2.x");
  });

  // Documented, not accidental: semver treats the `v` prefix as cosmetic, so
  // dropping it changes nothing a resolver sees.
  test("a leading v is normalised away", () => {
    expect(rewriteRange("v1.0.1", "1.2.0")).toBe("1.2.0");
  });
});

describe("applyTarget", () => {
  test("moves every Flow dependency and leaves the rest untouched", () => {
    const updated = applyTarget(manifest, "1.2.0", flowPackages);
    expect(updated.dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.2.0",
      "@mittwald/flow-icons-pro": "1.2.0",
      react: "^19.2.0",
    });
    expect(updated.devDependencies).toEqual({
      "@mittwald/ext-bridge": "~1.2.0",
    });
  });

  test("does not mutate the input", () => {
    applyTarget(manifest, "1.2.0", flowPackages);
    expect(manifest.dependencies["@mittwald/flow-react-components"]).toBe(
      "^1.0.1",
    );
  });
});

describe("detectCurrentVersion", () => {
  const deps = findFlowDependencies(manifest, flowPackages);

  test("prefers the installed version", () => {
    expect(detectCurrentVersion(deps, () => "1.0.4")).toBe("1.0.4");
  });

  test("falls back to the lowest version the range allows", () => {
    expect(detectCurrentVersion(deps, () => undefined)).toBe("1.0.1");
  });

  test("returns undefined when there is nothing to go on", () => {
    expect(detectCurrentVersion([], () => undefined)).toBeUndefined();
  });

  test("an installed version on a later dependency still wins", () => {
    expect(
      detectCurrentVersion(deps, (name) =>
        name === "@mittwald/ext-bridge" ? "1.0.4" : undefined,
      ),
    ).toBe("1.0.4");
  });

  test("an unparseable installed version is skipped, not trusted", () => {
    expect(
      detectCurrentVersion(deps, (name) =>
        name === "@mittwald/flow-react-components" ? "garbage" : "1.0.4",
      ),
    ).toBe("1.0.4");
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/manifest.test.ts`
Expected: FAIL — `Failed to resolve import "../manifest"`.

- [ ] **Step 4: Implement the manifest module**

Create `packages/codemods/src/manifest.ts`:

```ts
import { minVersion, valid } from "semver";

export type DependencyField =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies";

const dependencyFields: DependencyField[] = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

export interface Manifest {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export interface FlowDependency {
  field: DependencyField;
  name: string;
  range: string;
}

/** Every Flow-line dependency the manifest declares, in field order. */
export const findFlowDependencies = (
  manifest: Manifest,
  flowPackages: string[],
): FlowDependency[] =>
  dependencyFields.flatMap((field) =>
    Object.entries(manifest[field] ?? {})
      .filter(([name]) => flowPackages.includes(name))
      .map(([name, range]) => ({ field, name, range })),
  );

/** A leading range operator, if the range has one. */
const operatorPattern = /^(\^|~|>=|<=|>|<|=)?\s*(.+)$/;

/**
 * The range moved onto `target`, keeping whatever operator it had.
 *
 * A range this cannot read — `workspace:*`, `*`, a dist-tag, a URL — is
 * returned unchanged. Rewriting it would replace a deliberate choice with a
 * guess.
 */
export const rewriteRange = (range: string, target: string): string => {
  const match = operatorPattern.exec(range.trim());
  if (!match) {
    return range;
  }

  const [, operator = "", version = ""] = match;
  return valid(version) === null ? range : `${operator}${target}`;
};

/** A copy of the manifest with every Flow dependency moved onto `target`. */
export const applyTarget = <T extends Manifest>(
  manifest: T,
  target: string,
  flowPackages: string[],
): T => {
  const updated = structuredClone(manifest);

  for (const { field, name, range } of findFlowDependencies(
    manifest,
    flowPackages,
  )) {
    const entries = updated[field];
    if (entries !== undefined) {
      entries[name] = rewriteRange(range, target);
    }
  }

  return updated;
};

/**
 * The version the consumer is on.
 *
 * The installed version is the accurate answer, so it wins. The fallback is the
 * lowest version the declared range allows, which is deliberately conservative:
 * being too low can only select _extra_ entries, and every transform is
 * idempotent, so an extra run is a no-op rather than a corruption.
 */
export const detectCurrentVersion = (
  dependencies: FlowDependency[],
  readInstalledVersion: (name: string) => string | undefined,
): string | undefined => {
  for (const { name } of dependencies) {
    const installed = readInstalledVersion(name);
    if (installed !== undefined && valid(installed) !== null) {
      return installed;
    }
  }

  for (const { range } of dependencies) {
    const lowest = minVersion(range);
    if (lowest !== null) {
      return lowest.version;
    }
  }

  return undefined;
};
```

- [ ] **Step 5: Run the test and verify it passes**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/manifest.test.ts`
Expected: PASS — 10 tests.

- [ ] **Step 6: Commit**

```bash
git add packages/codemods/src/manifest.ts packages/codemods/src/flowPackages.generated.ts \
  packages/codemods/dev/generate/flowPackages.ts packages/codemods/dev/generateCli.ts \
  packages/codemods/src/tests/manifest.test.ts
git commit -m "feat(codemods): find and rewrite Flow dependencies in a consumer manifest"
```

---

## Task 8: The install seam and the dirty-tree guard

**Files:**

- Create: `packages/codemods/src/install.ts`
- Create: `packages/codemods/src/git.ts`
- Create: `packages/codemods/src/tests/install.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `PackageManager`, `detectPackageManager(lockfiles): PackageManager`,
  `InstallRunner`, `runInstall: InstallRunner` from `src/install.ts`;
  `hasUncommittedChanges(cwd): boolean` from `src/git.ts`. Task 12 injects an
  `InstallRunner`.

`runInstall` is a named type, not an inline call, because there is no
`--no-install` flag: the seam for tests lives in the code, not in the public
surface.

- [ ] **Step 1: Write the failing test**

Create `packages/codemods/src/tests/install.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { detectPackageManager, installCommand } from "../install";

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
```

- [ ] **Step 2: Run the test and verify it fails**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/install.test.ts`
Expected: FAIL — `Failed to resolve import "../install"`.

- [ ] **Step 3: Implement the installer**

Create `packages/codemods/src/install.ts`:

```ts
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

/** Lockfile to manager, in precedence order. */
const lockfiles: [string, PackageManager][] = [
  ["pnpm-lock.yaml", "pnpm"],
  // Both Bun lockfile names: `bun.lock` (text) is the default only from Bun
  // 1.2; before that Bun writes the binary `bun.lockb`, which plenty of
  // projects still have. Missing it would fall through to the npm default and
  // run `npm install` on a Bun project, leaving a stray package-lock.json.
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
];

/**
 * The package manager a project uses, from the lockfiles present.
 *
 * Npm is the fallback: it is the one manager that is always available next to
 * Node, so a project with no lockfile still gets an install rather than an
 * error.
 */
export const detectPackageManager = (present: string[]): PackageManager => {
  for (const [lockfile, manager] of lockfiles) {
    if (present.includes(lockfile)) {
      return manager;
    }
  }
  return "npm";
};

export const detectPackageManagerIn = (cwd: string): PackageManager =>
  detectPackageManager(
    lockfiles
      .map(([lockfile]) => lockfile)
      .filter((lockfile) => existsSync(join(cwd, lockfile))),
  );

export interface InstallCommand {
  command: string;
  args: string[];
  /** Extra environment for the install. Empty when none is needed. */
  env: Record<string, string>;
}

/**
 * How to install with a given manager, so that the install actually updates the
 * lockfile.
 *
 * `upgrade` has just rewritten `package.json`, so the lockfile is deliberately
 * stale. pnpm and Yarn Berry both switch on frozen/immutable installs by
 * themselves when they detect CI, where an install then _fails_ instead of
 * updating — and CI is exactly where this runs unattended. pnpm takes a flag;
 * Yarn's flag differs between Classic and Berry, so it gets the environment
 * variable instead, which Classic ignores harmlessly.
 */
export const installCommand = (manager: PackageManager): InstallCommand => {
  switch (manager) {
    case "pnpm":
      return {
        command: "pnpm",
        args: ["install", "--no-frozen-lockfile"],
        env: {},
      };
    case "yarn":
      return {
        command: "yarn",
        args: ["install"],
        env: { YARN_ENABLE_IMMUTABLE_INSTALLS: "false" },
      };
    case "npm":
    case "bun":
      return { command: manager, args: ["install"], env: {} };
  }
};

/**
 * Runs the install.
 *
 * A named type rather than a bare call so tests can substitute it. There is no
 * `--no-install` flag: the seam belongs in the code, not in the CLI surface.
 */
export type InstallRunner = (manager: PackageManager, cwd: string) => void;

export const runInstall: InstallRunner = (manager, cwd) => {
  const { command, args, env } = installCommand(manager);
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
};
```

- [ ] **Step 4: Run the test and verify it passes**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/install.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 5: Implement the dirty-tree guard**

Create `packages/codemods/src/git.ts`:

```ts
import { execFileSync } from "node:child_process";

/**
 * Whether the working tree has changes that a codemod run would mix into.
 *
 * `upgrade` refuses on a dirty tree unless `--allow-dirty`. This matters most
 * where nobody is watching: `-y` is implied when stdin is not a TTY, so an
 * agent or CI run would otherwise blend its own unfinished work into the
 * codemod diff with no way to separate them afterwards.
 *
 * A directory that is not a git repository counts as clean — refusing there
 * would block a legitimate run for a reason the consumer cannot fix.
 */
export const hasUncommittedChanges = (cwd: string): boolean => {
  try {
    const status = execFileSync("git", ["status", "--porcelain"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return status.trim() !== "";
  } catch (error) {
    // Only "not a git repository" counts as clean. git answers that with exit
    // 128; a missing binary throws `ENOENT` with no exit status at all. Treating
    // the two alike would make the guard fail *open* — it would report a clean
    // tree on a machine without git, which is exactly the minimal CI container
    // where nobody is watching the run.
    if ((error as { status?: number }).status === 128) {
      return false;
    }
    throw new Error(
      `Could not check the working tree with git: ${
        error instanceof Error ? error.message : error
      }`,
      { cause: error },
    );
  }
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/codemods/src/install.ts packages/codemods/src/git.ts \
  packages/codemods/src/tests/install.test.ts
git commit -m "feat(codemods): detect the package manager and guard a dirty tree"
```

---

## Task 9: Running a codemod

**Files:**

- Create: `packages/codemods/src/run/jscodeshift.ts`
- Create: `packages/codemods/src/tests/runCodemod.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `runCodemod(options): CodemodResult` and the
  `CodemodOptions`/`CodemodResult` interfaces. Tasks 11 and 12 call it.

The transform path resolves relative to this module, so
`dist/run/jscodeshift.js` and `src/run/jscodeshift.ts` both reach
`<packageRoot>/src/transforms` — `dist` mirrors `src`'s depth, which is why the
transforms ship as `.ts` at their source path.

- [ ] **Step 1: Write the failing test**

Create `packages/codemods/src/tests/runCodemod.test.ts`:

```ts
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runCodemod } from "../run/jscodeshift";

const project = (source: string): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-codemods-run-"));
  writeFileSync(join(dir, "input.tsx"), source);
  return dir;
};

const usesAlign = `import { Align } from "@mittwald/flow-react-components";
export const Row = () => <Align />;
`;

describe("runCodemod", () => {
  test("applies a codemod by its catalogue id and reports the change", async () => {
    const dir = project(usesAlign);
    const result = await runCodemod({ id: "align-to-combine", path: dir });

    expect(result).toMatchObject({
      errors: 0,
      changed: 1,
      processedNothing: false,
    });
    expect(readFileSync(join(dir, "input.tsx"), "utf8")).toContain("Combine");
  });

  test("a file the codemod does not touch counts as unmodified, not an error", async () => {
    const dir = project(`export const nothing = 1;\n`);
    const result = await runCodemod({ id: "align-to-combine", path: dir });

    expect(result).toMatchObject({ errors: 0, changed: 0, unmodified: 1 });
  });

  test("--dry leaves the file alone but still reports what it would change", async () => {
    const dir = project(usesAlign);
    const result = await runCodemod({
      id: "align-to-combine",
      path: dir,
      dry: true,
    });

    expect(result.changed).toBe(1);
    expect(readFileSync(join(dir, "input.tsx"), "utf8")).toContain("Align");
  });

  // The regression this module exists to prevent: the CLI's text summary would
  // have this file's `// 42 ok` beat the real count, because `--print` writes
  // the source before the summary.
  test("--print cannot corrupt the counts", async () => {
    const dir = project(`// 42 ok and 7 errors, to fool a regex\n${usesAlign}`);
    const result = await runCodemod({
      id: "align-to-combine",
      path: dir,
      print: true,
    });

    expect(result).toMatchObject({ changed: 1, errors: 0 });
  });

  test("a path with nothing to process says so instead of reporting zero changes", async () => {
    const result = await runCodemod({
      id: "align-to-combine",
      path: join(tmpdir(), "flow-codemods-nothing-here"),
    });

    expect(result.processedNothing).toBe(true);
  });

  test("an unknown id fails with a message naming it", async () => {
    const dir = project(usesAlign);
    await expect(
      runCodemod({ id: "no-such-codemod", path: dir }),
    ).rejects.toThrow(/no-such-codemod/);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/runCodemod.test.ts`
Expected: FAIL — `Failed to resolve import "../run/jscodeshift"`.

- [ ] **Step 3: Implement the runner**

Create `packages/codemods/src/run/jscodeshift.ts`:

```ts
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — jscodeshift ships no types for its Runner.
import { run as runJscodeshift } from "jscodeshift/src/Runner.js";

/**
 * `<packageRoot>/src/transforms`, from either `src/run` or `dist/run`.
 *
 * `dist` mirrors `src`'s directory depth, so one relative path serves the test
 * run and the published binary. The transforms are not compiled into `dist`:
 * jscodeshift puts a transform through its own babel pipeline, so it wants the
 * `.ts` file.
 */
const transformsDir = fileURLToPath(
  new URL("../../src/transforms", import.meta.url),
);

export interface CodemodOptions {
  /** A catalogue id — the transform file name without its extension. */
  id: string;
  /** File or directory to transform. */
  path: string;
  dry?: boolean;
  print?: boolean;
}

export interface CodemodResult {
  changed: number;
  unmodified: number;
  /** Files the transform declined by returning nothing. */
  skipped: number;
  errors: number;
  /** True when jscodeshift accounted for no file at all — see below. */
  processedNothing: boolean;
}

/** The four counters jscodeshift's Runner resolves with. */
interface RunnerStats {
  error: number;
  ok: number;
  nochange: number;
  skip: number;
}

/**
 * Runs one codemod over a path.
 *
 * This drives jscodeshift's `Runner` directly rather than its CLI. The CLI only
 * reports its counts as text, and scraping that text is not safe: `--print`
 * writes the transformed source to stdout _before_ the summary, so a source
 * comment like `// 42 ok` wins a regex looking for `(\d+) ok`. The Runner
 * resolves with the counters as numbers, and it distinguishes `skip` (the
 * transform returned nothing) from `nochange` (it returned identical source) —
 * a difference the CLI's summary and any regex over it both lose.
 *
 * `processedNothing` exists because jscodeshift reports a path with no matching
 * files and a worker that died before touching one the same way: every counter
 * zero, no error. The caller must not render that as "0 files changed", which
 * reads like success.
 */
export const runCodemod = async ({
  id,
  path,
  dry = false,
  print = false,
}: CodemodOptions): Promise<CodemodResult> => {
  const transform = `${transformsDir}/${id}.ts`;

  if (!existsSync(transform)) {
    throw new Error(
      `"${id}" is not a codemod in this package. Run \`flow-codemods list\` to see the available ids.`,
    );
  }

  let stats: RunnerStats;
  try {
    stats = (await runJscodeshift(transform, [path], {
      parser: "tsx",
      silent: true,
      dry,
      print,
    })) as RunnerStats;
  } catch (error) {
    throw new Error(
      `Running ${id} failed: ${error instanceof Error ? error.message : error}`,
    );
  }

  return {
    changed: stats.ok,
    unmodified: stats.nochange,
    skipped: stats.skip,
    errors: stats.error,
    processedNothing:
      stats.ok + stats.nochange + stats.skip + stats.error === 0,
  };
};
```

- [ ] **Step 4: Run the test and verify it passes**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/runCodemod.test.ts`
Expected: PASS — 4 tests. These spawn the real jscodeshift CLI; the 60 s
`testTimeout` in `vitest.config.ts` is why they do not flake on a cold runner.

- [ ] **Step 5: Commit**

```bash
git add packages/codemods/src/run packages/codemods/src/tests/runCodemod.test.ts
git commit -m "feat(codemods): run a codemod by its catalogue id"
```

---

## Task 10: The `list` command

**Files:**

- Create: `packages/codemods/src/cli/list.ts`
- Create: `packages/codemods/src/tests/list.test.ts`
- Modify: `packages/codemods/src/cli.ts`

**Interfaces:**

- Consumes: `allEntries` (Task 2), `selectEntries`/`sortBySince` (Task 5),
  `ParsedCommand` (Task 1).
- Produces: `renderList({ entries, from, to, json }): string`. Task 12 reuses it
  to print the manual leftovers.

`list` is the agent entry point with no side effects: no writes, no install, no
network. An agent can plan against it before touching anything.

- [ ] **Step 1: Write the failing test**

Create `packages/codemods/src/tests/list.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { renderList } from "../cli/list";

const entry = (
  id: string,
  since: string,
  action: CatalogEntry["action"],
): CatalogEntry => ({
  id,
  since,
  title: id,
  kind: "migration",
  action,
  remotePackage: false,
  detect: action === "none" ? undefined : `rg ${id}`,
  apply: `apply ${id}`,
  verify: `verify ${id}`,
});

const entries = [
  entry("with-codemod", "1.1.0", "codemod"),
  entry("by-hand", "1.2.0", "manual"),
  entry("behaviour-only", "1.3.0", "none"),
];

describe("renderList as text", () => {
  const text = renderList({ entries, from: "1.0.0", to: "2.0.0", json: false });

  test("names every entry with its version and what it needs", () => {
    expect(text).toContain("with-codemod");
    expect(text).toContain("1.1.0");
    expect(text).toContain("by-hand");
    expect(text).toContain("behaviour-only");
  });

  test("shows the ready-made invocation for a codemod", () => {
    expect(text).toContain("flow-codemods@latest with-codemod");
  });

  test("shows apply and verify, which is what an agent acts on", () => {
    expect(text).toContain("apply by-hand");
    expect(text).toContain("verify by-hand");
  });

  test("says so when the range holds nothing", () => {
    expect(
      renderList({ entries, from: "3.0.0", to: "3.1.0", json: false }),
    ).toContain("Nothing to migrate");
  });
});

describe("renderList as JSON", () => {
  test("emits the selected entries as a parseable array", () => {
    const parsed = JSON.parse(
      renderList({ entries, from: "1.0.0", to: "2.0.0", json: true }),
    ) as CatalogEntry[];

    expect(parsed.map((selected) => selected.id)).toEqual([
      "with-codemod",
      "by-hand",
      "behaviour-only",
    ]);
    expect(parsed[0]).toMatchObject({ apply: "apply with-codemod" });
  });

  test("an empty range is an empty array, not a message", () => {
    expect(
      renderList({ entries, from: "3.0.0", to: "3.1.0", json: true }),
    ).toBe("[]");
  });
});

describe("renderList without bounds", () => {
  test("no bounds lists the whole catalogue", () => {
    const parsed = JSON.parse(
      renderList({ entries, json: true }),
    ) as CatalogEntry[];
    expect(parsed).toHaveLength(3);
  });
});

// The subtlest behaviour here, and the one a later reader is most likely to
// "simplify" away.
describe("tools are browsable but never required", () => {
  const withTool = [
    ...entries,
    { ...entry("port-it", "1.0.0", "codemod"), kind: "tool" as const },
  ];

  test("an unbounded list includes a tool", () => {
    const parsed = JSON.parse(
      renderList({ entries: withTool, json: true }),
    ) as CatalogEntry[];
    expect(parsed.map((e) => e.id)).toContain("port-it");
  });

  test("a bounded list never includes a tool", () => {
    const parsed = JSON.parse(
      renderList({ entries: withTool, from: "0.9.0", to: "2.0.0", json: true }),
    ) as CatalogEntry[];
    expect(parsed.map((e) => e.id)).not.toContain("port-it");
  });

  test("a lower bound of none still reaches the oldest entry", () => {
    const oldest = [entry("ancient", "0.0.0", "manual")];
    const parsed = JSON.parse(
      renderList({ entries: oldest, to: "1.0.0", json: true }),
    ) as CatalogEntry[];
    expect(parsed.map((e) => e.id)).toEqual(["ancient"]);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/list.test.ts`
Expected: FAIL — `Failed to resolve import "../cli/list"`.

- [ ] **Step 3: Implement the renderer**

Create `packages/codemods/src/cli/list.ts`:

```ts
import type { CatalogEntry } from "../catalog/entries";
import { selectEntries, sortBySince } from "../catalog/select";

export interface RenderListInput {
  entries: CatalogEntry[];
  /** Both bounds are optional. Without them the whole catalogue is listed. */
  from?: string;
  to?: string;
  json: boolean;
}

const needs: Record<CatalogEntry["action"], string> = {
  codemod: "codemod",
  manual: "by hand",
  none: "no code change",
};

const renderEntry = (entry: CatalogEntry): string => {
  const lines = [
    `${entry.id}  (${entry.since}, ${entry.kind}, ${needs[entry.action]})`,
    `  ${entry.title}`,
    `  apply:  ${entry.apply}`,
    `  verify: ${entry.verify}`,
  ];

  if (entry.detect !== undefined) {
    lines.push(`  detect: ${entry.detect}`);
  }
  if (entry.action === "codemod") {
    lines.push(`  run:    npx @mittwald/flow-codemods@latest ${entry.id} src`);
  }
  if (entry.remotePackage) {
    lines.push("  also applies to @mittwald/flow-remote-react-components");
  }

  return lines.join("\n");
};

/**
 * The migrations for a version range, as text or JSON.
 *
 * Read-only by design: this is what an agent can call to plan before it changes
 * anything. `--json` carries `apply`, `verify` and `detect` through unchanged,
 * because those are the fields it acts on.
 */
export const renderList = ({
  entries,
  from,
  to,
  json,
}: RenderListInput): string => {
  // The two paths differ in more than their bounds, deliberately: `sortBySince`
  // keeps `kind: "tool"` entries, `selectEntries` drops them. Unbounded, this is
  // a catalogue browser, and browsing is how someone finds the codemod that
  // ports an app between packages. Bounded, it answers "what does this version
  // range require of me" — and a port is never required by a version range. Do
  // not unify these.
  //
  // `0.0.0-0` rather than `0.0.0` as the lower sentinel: the gate's
  // `current < since` is strict, so `0.0.0` would hide an entry whose `since` is
  // exactly `0.0.0`. A prerelease of `0` sorts below every published version.
  // (`0.0.0-0.0` is lower still; nothing publishes that.)
  const selected =
    from === undefined && to === undefined
      ? sortBySince(entries)
      : selectEntries(entries, from ?? "0.0.0-0", to ?? "9999.0.0");

  if (json) {
    return JSON.stringify(selected, null, 2);
  }

  if (selected.length === 0) {
    return "Nothing to migrate in that range.\n";
  }

  return `${selected.map(renderEntry).join("\n\n")}\n`;
};
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `cd packages/codemods && corepack pnpm vitest run src/tests/list.test.ts`
Expected: PASS — 7 tests.

- [ ] **Step 5: Wire it into the CLI**

In `packages/codemods/src/cli.ts`, add the import and the branch:

```ts
import { allEntries } from "./catalog/entries";
import { renderList } from "./cli/list";
```

```ts
    case "list":
      process.stdout.write(
        renderList({
          entries: allEntries,
          from: parsed.from,
          to: parsed.to,
          json: parsed.json,
        }),
      );
      return 0;
```

- [ ] **Step 6: Verify against the real catalogue**

Run:
`pnpm nx build codemods && node packages/codemods/dist/cli.js list --from 0.2.0-alpha.700 --to 1.0.2`
Expected: the entries between those versions, oldest first, each with
`apply`/`verify`. `to-remote-package` must **not** appear — it is
`kind: "tool"`.

Run: `node packages/codemods/dist/cli.js list --json | head -20` Expected: valid
JSON.

An **unbounded** `list` includes `kind: "tool"` entries on purpose — that is how
someone discovers `to-remote-package`. A **bounded** one never does, because a
version range must not select a port.

- [ ] **Step 7: Commit**

```bash
git add packages/codemods/src/cli packages/codemods/src/tests/list.test.ts
git commit -m "feat(codemods): add the list command"
```

---

## Task 11: The single-codemod command

**Files:**

- Create: `packages/codemods/src/cli/codemod.ts`
- Create: `packages/codemods/src/tests/codemodCommand.test.ts`
- Modify: `packages/codemods/src/cli.ts`

**Interfaces:**

- Consumes: `runCodemod` (Task 9), `allEntries` (Task 2), `ParsedCommand` (Task
  1).
- Produces: `resolveSourcePath(explicit, cwd, exists): string` and
  `runSingleCodemod(parsed, deps): Promise<number>`. Task 12 reuses
  `resolveSourcePath`.

- [ ] **Step 1: Write the failing test**

Create `packages/codemods/src/tests/codemodCommand.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { parseArguments } from "../cli/args";
import {
  resolveSourcePath,
  runSingleCodemod,
  type CodemodCommandDeps,
} from "../cli/codemod";
import type { CodemodResult } from "../run/jscodeshift";

describe("resolveSourcePath", () => {
  test("an explicit path wins", () => {
    expect(resolveSourcePath("app", "/project", () => true)).toBe("app");
  });

  test("src is the default when it exists", () => {
    expect(
      resolveSourcePath(undefined, "/project", (path) => path.endsWith("src")),
    ).toBe("src");
  });

  test("the working directory is the fallback", () => {
    expect(resolveSourcePath(undefined, "/project", () => false)).toBe(".");
  });
});

// `CodemodCommandDeps` takes an injectable `run` and `log` for exactly this —
// every branch below is reachable without touching a file or jscodeshift.
describe("runSingleCodemod", () => {
  const result = (over: Partial<CodemodResult> = {}): CodemodResult => ({
    changed: 1,
    unmodified: 0,
    skipped: 0,
    errors: 0,
    processedNothing: false,
    ...over,
  });

  const call = async (
    argv: string[],
    run: CodemodCommandDeps["run"],
  ): Promise<{ code: number; output: string }> => {
    const lines: string[] = [];
    const code = await runSingleCodemod(parseArguments(argv), {
      cwd: "/project",
      log: (message) => lines.push(message),
      run,
    });
    return { code, output: lines.join("\n") };
  };

  const ok = async () => result();

  test("an id that is not in the catalogue points at list", async () => {
    const { code, output } = await call(["no-such-thing", "src"], ok);
    expect(code).toBe(1);
    expect(output).toContain("no-such-thing");
    expect(output).toContain("flow-codemods list");
  });

  test("a catalogued id with no codemod prints apply and verify", async () => {
    const { code, output } = await call(
      ["table-render-prop-removed", "src"],
      ok,
    );
    expect(code).toBe(1);
    expect(output).toContain("apply:");
    expect(output).toContain("verify:");
  });

  test("a successful run ends with verify", async () => {
    const { code, output } = await call(["align-to-combine", "src"], ok);
    expect(code).toBe(0);
    expect(output).toContain("1 file(s) changed");
    expect(output).toContain("verify:");
  });

  test("errors are reported and fail", async () => {
    const { code, output } = await call(["align-to-combine", "src"], async () =>
      result({ changed: 0, errors: 2 }),
    );
    expect(code).toBe(1);
    expect(output).toContain("2 file(s) failed");
  });

  test("processing nothing is not reported as zero changes", async () => {
    const { code, output } = await call(["align-to-combine", "src"], async () =>
      result({ changed: 0, processedNothing: true }),
    );
    expect(code).toBe(1);
    expect(output).toContain("no files");
  });

  test("a transform that declines every file does not read as success", async () => {
    const { code, output } = await call(["align-to-combine", "src"], async () =>
      result({ changed: 0, skipped: 3 }),
    );
    expect(code).toBe(1);
    expect(output).toContain("declined all 3");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/codemodCommand.test.ts`
Expected: FAIL — `Failed to resolve import "../cli/codemod"`.

- [ ] **Step 3: Implement the command**

Create `packages/codemods/src/cli/codemod.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { allEntries } from "../catalog/entries";
import type { ParsedCommand } from "./args";
import { runCodemod } from "../run/jscodeshift";

/**
 * Which sources to transform.
 *
 * `src` is the default because that is where a Flow consumer's components live,
 * and the working directory is the fallback. The caller prints the result
 * either way — a codemod that silently ran over the wrong tree is worse than
 * one that refused.
 */
export const resolveSourcePath = (
  explicit: string | undefined,
  cwd: string,
  exists: (path: string) => boolean = existsSync,
): string => {
  if (explicit !== undefined) {
    return explicit;
  }
  return exists(join(cwd, "src")) ? "src" : ".";
};

export interface CodemodCommandDeps {
  cwd: string;
  log: (message: string) => void;
  run?: typeof runCodemod;
}

export const runSingleCodemod = async (
  parsed: ParsedCommand,
  { cwd, log, run = runCodemod }: CodemodCommandDeps,
): Promise<number> => {
  const id = parsed.id ?? "";
  const entry = allEntries.find((candidate) => candidate.id === id);

  if (entry === undefined) {
    log(
      `"${id}" is not a codemod in this package. Run \`flow-codemods list\` to see the available ids.`,
    );
    return 1;
  }
  if (entry.action !== "codemod") {
    log(
      `"${id}" has no codemod — it is a ${entry.action === "none" ? "behaviour change" : "manual change"}.\n\napply:  ${entry.apply}\nverify: ${entry.verify}`,
    );
    return 1;
  }

  const path = resolveSourcePath(parsed.path, cwd);
  log(`Running ${id} over ${path}`);

  const result = await run({ id, path, dry: parsed.dry, print: parsed.print });

  if (result.errors > 0) {
    log(`${id}: ${result.errors} file(s) failed to transform.`);
    return 1;
  }
  // Not the same as "0 files changed": jscodeshift reports an empty path and a
  // dead worker identically, so say what happened rather than implying success.
  if (result.processedNothing) {
    log(`${id}: no files under ${path} were processed. Is the path right?`);
    return 1;
  }

  // The same trap as `processedNothing`, one field over: a transform that
  // declines a file by returning nothing counts as `skipped`, not `unmodified`.
  // If every file was skipped and none changed, "0 file(s) changed" would read
  // as a clean no-op run when in fact the transform bailed on everything.
  if (result.changed === 0 && result.skipped > 0) {
    log(
      `${id}: the transform declined all ${result.skipped} file(s) it looked at, and changed none.`,
    );
    return 1;
  }

  const skipped = result.skipped > 0 ? `, ${result.skipped} skipped` : "";
  log(
    `${id}: ${result.changed} file(s) changed, ${result.unmodified} unchanged${skipped}.\nverify: ${entry.verify}`,
  );
  return 0;
};
```

Two behaviours worth keeping: an id that exists in the catalogue but has no
codemod prints its `apply`/`verify` instead of a bare error, and a successful
run ends by printing `verify`, so the next step is on screen rather than in a
guide.

- [ ] **Step 4: Run the test and verify it passes**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/codemodCommand.test.ts`
Expected: PASS — 3 tests.

- [ ] **Step 5: Wire it into the CLI**

In `packages/codemods/src/cli.ts`:

```ts
import { runSingleCodemod } from "./cli/codemod";
```

```ts
    case "codemod":
      return await runSingleCodemod(parsed, {
        cwd: process.cwd(),
        log: (message) => process.stdout.write(`${message}\n`),
      });
```

- [ ] **Step 6: Verify end to end**

```bash
pnpm nx build codemods
CLI="$PWD/packages/codemods/dist/cli.js"
rm -rf /tmp/flow-cli-check && mkdir -p /tmp/flow-cli-check/src
printf 'import { Align } from "@mittwald/flow-react-components";\nexport const R = () => <Align />;\n' > /tmp/flow-cli-check/src/a.tsx
cd /tmp/flow-cli-check && node "$CLI" align-to-combine && cat src/a.tsx
```

Expected: `Combine` in the output, and the CLI printed `verify:`.

Also check the refusal path: `node "$CLI" table-render-prop-removed` Expected:
exit 1 with the entry's `apply`/`verify`, not a stack trace.

- [ ] **Step 7: Commit**

```bash
git add packages/codemods/src/cli packages/codemods/src/tests/codemodCommand.test.ts
git commit -m "feat(codemods): add the single-codemod command"
```

---

## Task 12: The `upgrade` command

**Files:**

- Create: `packages/codemods/src/cli/upgrade.ts`
- Create: `packages/codemods/src/tests/upgrade.test.ts`
- Modify: `packages/codemods/src/cli.ts`

**Interfaces:**

- Consumes: everything from Tasks 2, 5, 6, 7, 8, 9, 10, 11.
- Produces: `runUpgrade(parsed, deps): Promise<number>` and the `UpgradeDeps`
  interface.

Every side effect arrives through `UpgradeDeps`, so the whole orchestration is
testable without network, install, or a TTY.

- [ ] **Step 1: Write the failing test**

Create `packages/codemods/src/tests/upgrade.test.ts`:

```ts
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parseArguments } from "../cli/args";
import { runUpgrade, type UpgradeDeps } from "../cli/upgrade";

const registry = {
  versions: ["0.2.0-alpha.646", "1.0.0", "1.0.1", "1.0.5", "1.1.0", "1.2.0"],
  distTags: { latest: "1.2.0" },
};

const project = (dependencies: Record<string, string>): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-upgrade-"));
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "consumer", dependencies }, null, 2),
  );
  return dir;
};

const manifestOf = (dir: string): { dependencies: Record<string, string> } =>
  JSON.parse(readFileSync(join(dir, "package.json"), "utf8")) as {
    dependencies: Record<string, string>;
  };

interface Recorded {
  installs: string[];
  codemods: string[];
  output: string[];
}

const deps = (
  cwd: string,
  recorded: Recorded,
  overrides: Partial<UpgradeDeps> = {},
): UpgradeDeps => ({
  cwd,
  fetchVersions: async () => registry,
  install: (manager) => recorded.installs.push(manager),
  runCodemod: ({ id }) => {
    recorded.codemods.push(id);
    return { changed: 1, unmodified: 0, errors: 0, output: "" };
  },
  choose: async (entries) => entries,
  isDirty: () => false,
  readInstalledVersion: () => undefined,
  log: (message) => recorded.output.push(message),
  ...overrides,
});

const record = (): Recorded => ({ installs: [], codemods: [], output: [] });

describe("runUpgrade", () => {
  test("bumps every Flow dependency, installs, then runs the codemods", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
      "@mittwald/flow-icons-pro": "0.2.0-alpha.640",
      react: "^19.2.0",
    });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(0);
    expect(manifestOf(cwd).dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.2.0",
      "@mittwald/flow-icons-pro": "1.2.0",
      react: "^19.2.0",
    });
    expect(recorded.installs).toEqual(["npm"]);
    expect(recorded.codemods.length).toBeGreaterThan(0);
  });

  test("the install happens before any codemod runs", async () => {
    const order: string[] = [];
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        install: () => order.push("install"),
        runCodemod: ({ id }) => {
          order.push(`codemod:${id}`);
          return { changed: 0, unmodified: 1, errors: 0, output: "" };
        },
      }),
    );

    expect(order[0]).toBe("install");
  });

  test("a target at or below the current version changes nothing", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.2.0" });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "latest", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(0);
    expect(manifestOf(cwd).dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.2.0",
    });
    expect(recorded.installs).toEqual([]);
    expect(recorded.codemods).toEqual([]);
    expect(recorded.output.join("\n")).toMatch(/already on/i);
  });

  test("a dirty tree is refused, and --allow-dirty overrides it", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });
    const dirty = record();

    const refused = await runUpgrade(
      parseArguments(["upgrade", "-y"]),
      deps(cwd, dirty, { isDirty: () => true }),
    );

    expect(refused).toBe(1);
    expect(dirty.installs).toEqual([]);
    expect(dirty.output.join("\n")).toMatch(/uncommitted|--allow-dirty/);

    const allowed = record();
    const code = await runUpgrade(
      parseArguments(["upgrade", "-y", "--allow-dirty"]),
      deps(cwd, allowed, { isDirty: () => true }),
    );
    expect(code).toBe(0);
  });

  test("a manifest with no Flow dependency is an error, not a silent success", async () => {
    const cwd = project({ react: "^19.2.0" });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(1);
    expect(recorded.output.join("\n")).toContain("No Flow");
  });

  test("an unresolvable revision names what it could not resolve", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "next", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(1);
    expect(recorded.output.join("\n")).toContain("next");
  });

  test("the entries no codemod covers are printed at the end", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded),
    );

    const output = recorded.output.join("\n");
    expect(output).toContain("by hand");
    expect(output).toContain("table-render-prop-removed");
  });

  test("the installed version wins over the declared range", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.0" });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, { readInstalledVersion: () => "1.1.0" }),
    );

    // 1.1.0, not 1.0.0 — nothing between them is selected.
    expect(recorded.output.join("\n")).toContain("1.1.0");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/upgrade.test.ts`
Expected: FAIL — `Failed to resolve import "../cli/upgrade"`.

- [ ] **Step 3: Implement the orchestration**

Create `packages/codemods/src/cli/upgrade.ts`:

```ts
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gt } from "semver";
import { allEntries, type CatalogEntry } from "../catalog/entries";
import { selectEntries } from "../catalog/select";
import { flowPackages } from "../flowPackages.generated";
import { hasUncommittedChanges } from "../git";
import {
  detectPackageManagerIn,
  runInstall,
  type InstallRunner,
} from "../install";
import {
  applyTarget,
  detectCurrentVersion,
  findFlowDependencies,
  type Manifest,
} from "../manifest";
import { fetchVersions } from "../resolve/registry";
import { resolveTarget } from "../resolve/target";
import { runCodemod } from "../run/jscodeshift";
import type { ParsedCommand } from "./args";
import { resolveSourcePath } from "./codemod";
import { renderList } from "./list";

export interface UpgradeDeps {
  cwd: string;
  fetchVersions: typeof fetchVersions;
  install: InstallRunner;
  runCodemod: typeof runCodemod;
  /** Which codemods to apply. `-y` and a non-TTY pass everything through. */
  choose: (entries: CatalogEntry[]) => Promise<CatalogEntry[]>;
  isDirty: (cwd: string) => boolean;
  readInstalledVersion: (cwd: string, name: string) => string | undefined;
  log: (message: string) => void;
}

export const readInstalledVersion = (
  cwd: string,
  name: string,
): string | undefined => {
  try {
    const manifest = JSON.parse(
      readFileSync(join(cwd, "node_modules", name, "package.json"), "utf8"),
    ) as { version?: string };
    return manifest.version;
  } catch {
    return undefined;
  }
};

export const defaultUpgradeDeps = (cwd: string): UpgradeDeps => ({
  cwd,
  fetchVersions,
  install: runInstall,
  runCodemod,
  choose: async (entries) => entries,
  isDirty: hasUncommittedChanges,
  readInstalledVersion,
  log: (message) => process.stdout.write(`${message}\n`),
});

/**
 * Bump every Flow dependency, install, then run the codemods the crossed range
 * calls for — and end by naming what no codemod covers.
 *
 * The order is not cosmetic: the codemods run against the installed target, so
 * `tsc` can be green when the command returns.
 */
export const runUpgrade = async (
  parsed: ParsedCommand,
  deps: UpgradeDeps,
): Promise<number> => {
  const { cwd, log } = deps;

  if (!parsed.allowDirty && deps.isDirty(cwd)) {
    log(
      "The working tree has uncommitted changes. Codemods rewrite files in place, so commit or stash first — or pass --allow-dirty.",
    );
    return 1;
  }

  const manifestPath = join(cwd, "package.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const dependencies = findFlowDependencies(manifest, flowPackages);

  if (dependencies.length === 0) {
    log(`No Flow dependency found in ${manifestPath}. Nothing to upgrade.`);
    return 1;
  }

  const current = detectCurrentVersion(dependencies, (name) =>
    deps.readInstalledVersion(cwd, name),
  );
  if (current === undefined) {
    log("Could not determine the Flow version this project is on.");
    return 1;
  }

  // Every Flow package shares one version, so any of them answers for all.
  const anchor = dependencies[0]!.name;
  const { versions, distTags } = await deps.fetchVersions(anchor);
  const revision = parsed.revision ?? "minor";
  const target = resolveTarget({ revision, current, versions, distTags });

  if (target === undefined) {
    log(
      `Could not resolve "${revision}" to a published version of ${anchor}. Use patch, minor, major, a dist-tag, or an exact version.`,
    );
    return 1;
  }
  if (!gt(target, current)) {
    log(
      `Already on ${current}; "${revision}" resolves to ${target}. Nothing to do.`,
    );
    return 0;
  }

  log(`Upgrading Flow from ${current} to ${target}`);

  writeFileSync(
    manifestPath,
    `${JSON.stringify(applyTarget(manifest, target, flowPackages), null, 2)}\n`,
    "utf8",
  );
  for (const { name } of dependencies) {
    log(`  ${name} → ${target}`);
  }

  const manager = detectPackageManagerIn(cwd);
  log(`Installing with ${manager}`);
  deps.install(manager, cwd);

  const selected = selectEntries(allEntries, current, target);
  const automatic = selected.filter((entry) => entry.action === "codemod");
  const byHand = selected.filter((entry) => entry.action !== "codemod");

  const chosen = await deps.choose(automatic);
  const path = resolveSourcePath(parsed.path, cwd);

  for (const entry of chosen) {
    const result = await deps.runCodemod({
      id: entry.id,
      path,
      dry: parsed.dry,
      print: parsed.print,
    });
    // Same three-way distinction as the single-codemod command: "0 changed" on
    // its own would read as success where nothing was looked at, or where the
    // transform declined everything it saw.
    if (result.errors > 0) {
      log(`  ${entry.id}: ${result.errors} file(s) failed to transform`);
    } else if (result.processedNothing) {
      log(`  ${entry.id}: no files under ${path} were processed`);
    } else if (result.changed === 0 && result.skipped > 0) {
      log(`  ${entry.id}: declined all ${result.skipped} file(s) it looked at`);
    } else {
      log(`  ${entry.id}: ${result.changed} file(s) changed`);
    }
  }

  if (byHand.length > 0) {
    log(
      `\n${byHand.length} migration(s) in this range have no codemod. They are still open:\n`,
    );
    log(renderList({ entries: byHand, json: false }));
  } else {
    log("\nEvery migration in this range had a codemod.");
  }

  return 0;
};
```

- [ ] **Step 4: Run the test and verify it passes**

Run:
`cd packages/codemods && corepack pnpm vitest run src/tests/upgrade.test.ts`
Expected: PASS — 8 tests.

- [ ] **Step 5: Wire it into the CLI with the prompt and the non-TTY rule**

In `packages/codemods/src/cli.ts`:

```ts
import { checkbox } from "@inquirer/prompts";
import type { CatalogEntry } from "./catalog/entries";
import { defaultUpgradeDeps, runUpgrade } from "./cli/upgrade";
```

```ts
    case "upgrade": {
      // `-y` accepts every default, and no TTY implies it: CI and agent runs
      // have nobody to answer the prompt. That is also why the dirty-tree guard
      // exists — see git.ts.
      const interactive = !parsed.yes && process.stdin.isTTY === true;

      const choose = async (
        entries: CatalogEntry[],
      ): Promise<CatalogEntry[]> => {
        if (!interactive || entries.length === 0) {
          return entries;
        }
        const ids = await checkbox({
          message: "Which codemods should run?",
          choices: entries.map((entry) => ({
            name: `${entry.id} — ${entry.title}`,
            value: entry.id,
            checked: true,
          })),
        });
        return entries.filter((entry) => ids.includes(entry.id));
      };

      return runUpgrade(parsed, {
        ...defaultUpgradeDeps(process.cwd()),
        choose,
      });
    }
```

- [ ] **Step 6: Verify end to end against the real registry**

```bash
pnpm nx build codemods
CLI="$PWD/packages/codemods/dist/cli.js"
rm -rf /tmp/flow-upgrade-check && mkdir -p /tmp/flow-upgrade-check/src
cd /tmp/flow-upgrade-check
git init -q && printf 'node_modules\n' > .gitignore
printf '{"name":"c","dependencies":{"@mittwald/flow-react-components":"^0.2.0-alpha.640"}}' > package.json
printf 'import { Align } from "@mittwald/flow-react-components";\nexport const R = () => <Align />;\n' > src/a.tsx
git add -A && git commit -qm init
node "$CLI" upgrade major -y
```

Expected: the manifest moves to the current `latest`, a real `npm install` runs,
several codemods report changes, `src/a.tsx` says `Combine`, and the run ends
with the list of migrations that have no codemod.

Then confirm the no-op path: run the same command again. Expected:
`Already on …; "major" resolves to …. Nothing to do.` and exit 0.

- [ ] **Step 7: Commit**

```bash
git add packages/codemods/src/cli packages/codemods/src/tests/upgrade.test.ts
git commit -m "feat(codemods): add the upgrade command"
```

---

## Task 13: nx wiring and the generated-code gate

**Files:**

- Modify: `packages/codemods/project.json`
- Modify: `nx.json` (only if `build` has no `outputs` default that covers this)

**Interfaces:**

- Consumes: the three generators from Tasks 2, 3, 7.
- Produces: a `build` target whose cache invalidates correctly, and whose
  outputs the CI gate checks.

`AGENTS.md` warns about exactly this: wrong `inputs`/`outputs` make nx serve
stale results and `nx affected` miss work, and a gitignored path in `inputs`
contributes nothing to the hash. This task verifies the wiring instead of
assuming it.

- [ ] **Step 1: Confirm the target declares every output**

`packages/codemods/project.json` must list all four artefacts (from Task 4 Step
3):

```json
"outputs": [
  "{projectRoot}/dist",
  "{projectRoot}/src/migrations.generated.ts",
  "{projectRoot}/src/flowPackages.generated.ts",
  "{workspaceRoot}/packages/components/MIGRATION.md"
]
```

- [ ] **Step 2: Verify the cache invalidates on a catalogue edit**

```bash
pnpm nx build codemods                       # populate the cache
pnpm nx build codemods                       # expect: "existing outputs match the cache"
printf '\nOne more sentence.\n' >> packages/codemods/src/migrations/renamed-css-export.md
pnpm nx build codemods                       # expect: a real run, not a cache hit
git diff --stat packages/components/MIGRATION.md
```

Expected: the third run is **not** cached and `MIGRATION.md` changed.

Then revert:
`git checkout packages/codemods/src/migrations/renamed-css-export.md packages/components/MIGRATION.md`

If the third run came back cached, `src/migrations/**` is not reaching the
`codemods-src` named input — fix that before continuing. A stale catalogue that
generates a stale guide is exactly the drift this design exists to prevent.

- [ ] **Step 3: Verify `nx affected` sees the components package**

```bash
git checkout -b tmp/affected-check
printf '\nOne more sentence.\n' >> packages/codemods/src/migrations/renamed-css-export.md
pnpm nx build codemods && git add -A && git commit -qm "check"
pnpm nx show projects --affected --base=next
```

Expected: `codemods` **and** `components` — because the regenerated
`MIGRATION.md` is a tracked file inside `packages/components`, which ships it in
its tarball.

Then: `git checkout - && git branch -D tmp/affected-check`

- [ ] **Step 4: Verify the CI generated-code gate**

```bash
pnpm build
git diff --exit-code
```

Expected: exit 0. This is the CI step "Check all generated code is committed"; a
non-zero exit here means a generator is not deterministic — most likely the
guide generator disagreeing with Prettier, which is why it formats its own
output.

- [ ] **Step 5: Commit**

```bash
git add packages/codemods/project.json nx.json
git commit -m "chore(codemods): wire the generators into nx"
```

---

## Task 14: Documentation

**Files:**

- Modify: `packages/codemods/AGENTS.md`
- Modify: `AGENTS.md` (root)
- Modify: `apps/docs/src/content/01-get-started/versioning/index.mdx`
- Create: `docs/adr/0006-migration-catalogue.md`

**Interfaces:**

- Consumes: everything.
- Produces: nothing code depends on.

- [ ] **Step 1: Finish `packages/codemods/AGENTS.md`**

**It is already partly rewritten.** Task 4 replaced most of it while removing
the retired URL invocations, which was out of its scope but not wrong — the file
also still described `src/composites`, `flow1.ts`, the bundler and
`standalone.test.ts`, none of which exist. What is there now is accurate. Review
confirmed exactly two gaps against the draft below, so reconcile rather than
rewrite from scratch:

1. **The `## Layout` table was deleted and never replaced** — the file has no
   directory map at all now.
2. **The shared-imports caveat is missing.** Transforms no longer have to be
   self-contained, so one may import shared code; but `package.json` ships
   `"files": ["*.md", "dist", "src"]`, so anything a transform imports must stay
   inside `src`.

Read the current file first, then add what is missing from the draft.

Remove the section "The one rule: a transform must run standalone" in full — the
constraint is gone. Replace the `Layout` and `Adding a transform` sections:

```markdown
## Layout

| Path                    | What it holds                                                         |
| ----------------------- | --------------------------------------------------------------------- |
| `src/migrations`        | The catalogue. One Markdown file per migration. **The source.**       |
| `src/transforms`        | One jscodeshift transform per catalogue entry with `action: codemod`. |
| `src/catalog`           | Reading, typing and selecting catalogue entries.                      |
| `src/cli`, `src/cli.ts` | The `upgrade`, `list` and single-codemod commands.                    |
| `dev/generate`          | The three generators.                                                 |
| `src/tests`             | Fixture tests, all running through the real jscodeshift CLI.          |

## The catalogue is the single source

`packages/components/MIGRATION.md` and `src/migrations.generated.ts` are both
**generated** from `src/migrations/*.md`. Editing either by hand is futile — CI
fails on the diff. Edit the catalogue entry and run `pnpm nx build codemods`.

An entry's frontmatter is what an agent acts on:

- `kind` decides **when** it applies — `migration` on crossing `since`,
  `deprecation` as soon as the replacement exists, `tool` never.
- `action` decides **what** to do — `codemod`, `manual`, or `none` for a
  behaviour change that needs no edit.
- `detect` / `apply` / `verify` are the executable part. `detect` may
  over-match; it must not under-match. `verify` is a promise an agent will
  trust, so only put something there that really catches the change.

The id is dashed and lowercase, and it is the transform file name and the
`MIGRATION.md` anchor at once. `src/tests/catalog.test.ts` enforces all of this.

## Adding a migration

1. `src/migrations/<id>.md` with full frontmatter and a body copied in the voice
   of its neighbours.
2. A codemod only when the change is mechanically decidable from the source.
   Then `src/transforms/<id>.ts` and a fixture test in `src/tests`.
3. `pnpm nx build codemods`, and commit the regenerated guide and module.
4. `remotePackage` is checked against the remote package's real export surface
   by `src/tests/remoteScope.test.ts` — set it and let the test correct you.
```

Add a note that transforms may now import shared helpers, and that anything a
transform imports must stay inside `src` because `files` ships `src` wholesale.

- [ ] **Step 2: Update the root `AGENTS.md`**

Three edits:

1. Repo map — the `packages/codemods` row: `private` becomes
   `@mittwald/flow-codemods`, and the role becomes "The `upgrade` CLI and the
   migration catalogue that generates `MIGRATION.md`."
2. Generated-code table — three new rows:

```markdown
| `packages/components/MIGRATION.md` +
`packages/codemods/src/migrations.generated.ts` | `pnpm nx build codemods` | |
`packages/codemods/src/flowPackages.generated.ts` | same as above |
```

And delete the row for the composite bundles. 3. Development workflow — the
"Breaking changes for consumers" bullet:

```markdown
- **Breaking changes for consumers** ship with a **catalogue entry** in
  `packages/codemods/src/migrations` — which generates the `MIGRATION.md` entry
  — and a codemod when the change is mechanically decidable. The entry's
  `detect`/`apply`/`verify` fields are what an agent runs; fill them even when
  there is no codemod.
```

Also add a `Common failures` row, since this is a verified trap this plan
created:

```markdown
| Hand-edited `MIGRATION.md` reverts on the next build, or CI fails "Check all
generated code is committed" | `MIGRATION.md` is generated from
`packages/codemods/src/migrations/*.md` | Edit the catalogue entry, run
`pnpm nx build codemods`, commit both |
```

- [ ] **Step 3: Rewrite the German docs section**

In `apps/docs/src/content/01-get-started/versioning/index.mdx`, replace
`## Nutze den Codemod, wenn es einen gibt` and the `flow1` paragraph that
follows it:

````markdown
## Nutze die Codemod-CLI

Ein Befehl hebt alle Flow-Abhängigkeiten auf die Zielversion, installiert und
führt genau die Codemods aus, die der übersprungene Versionsbereich verlangt:

```shell
npx @mittwald/flow-codemods@latest upgrade
```
````

Ohne Argument geht es auf die nächste Minor innerhalb deiner Major.
`upgrade patch` bleibt auf deiner Minor, `upgrade major` überquert eine
Major-Grenze, und eine exakte Version oder ein Dist-Tag (`next`) gehen genau
dorthin.

Der Befehl ändert Dateien direkt und bricht auf einem unsauberen Git-Stand ab.

Er ersetzt den Migrationsleitfaden nicht: die meisten Einträge haben keinen
Codemod. Welche das für deinen Bereich sind, listet der Befehl am Ende auf –
oder vorab, ohne etwas zu verändern:

```shell
npx @mittwald/flow-codemods@latest list --from 0.2.0-alpha.700 --to 1.0.2
```

Einen einzelnen Codemod führst du über seine ID aus:

```shell
npx @mittwald/flow-codemods@latest align-to-combine src
```

````

Remove both `npx jscodeshift -t https://raw.githubusercontent.com/…` blocks — that path no longer exists.

- [ ] **Step 4: Write the ADR**

Create `docs/adr/0006-migration-catalogue.md`, following the shape of `0005-semver-contract.md`: Status `Accepted`, Date, Deciders, Affects, then Context / Decision / Consequences.

The decision to record, in short: the migration catalogue is the single source for consumer migrations; `MIGRATION.md` is generated from it; every migration carries `detect`/`apply`/`verify` so an agent can execute it whether or not a codemod exists; and `@mittwald/flow-codemods` is published so `upgrade` can exist, which retires the raw-GitHub-URL delivery path.

State the accepted cost plainly: URLs printed in already-published `MIGRATION.md` copies now 404. Doc URLs are not covered by ADR 0005, and the CLI serves those consumers better — `npx @mittwald/flow-codemods@latest upgrade` works from any old version, because npx always fetches the current CLI.

Also record the non-goal: `packages/ext-bridge/MIGRATION.md` keeps its own hand-written guide.

- [ ] **Step 5: Verify the whole repo**

```bash
pnpm build && git diff --exit-code
pnpm lint
pnpm test
````

Expected: all green. `pnpm lint` includes `format:check`, and the `pre-push`
hook runs it — an unformatted `.md` blocks the push, not the commit.

- [ ] **Step 6: Commit**

```bash
git add AGENTS.md packages/codemods/AGENTS.md \
  apps/docs/src/content/01-get-started/versioning/index.mdx \
  docs/adr/0006-migration-catalogue.md
git commit -m "docs(codemods): document the catalogue and the upgrade CLI"
```

- [ ] **Step 7: Open the pull request**

```bash
git push -u origin claude/flow-codemod-upgrade-cli-f87427
gh pr create --base next \
  --title "feat(codemods): add an upgrade CLI backed by a migration catalogue" \
  --body-file <(cat <<'BODY'
Publishes `@mittwald/flow-codemods` as a CLI and turns the migration guide into
generated output of a machine-readable catalogue.

## What this adds

`npx @mittwald/flow-codemods@latest upgrade [revision]` bumps every Flow
dependency to a resolved target, installs, runs the codemods the crossed range
calls for, and ends by listing the migrations that have no codemod.

`revision` is `patch` | `minor` | `major` | a dist-tag | an exact version,
default `minor`. The keyword bounds the target; the codemod set falls out of an
exact-version gate (`current < since <= target`). Keyword resolution excludes
prereleases, so `upgrade minor` never drifts onto the `next` line.

`list [--from] [--to] [--json]` prints the catalogue for a range without
touching anything — the entry point for an agent planning a migration.

## The catalogue

`packages/codemods/src/migrations/*.md` is now the single source for all 22
consumer migrations. `packages/components/MIGRATION.md` and
`src/migrations.generated.ts` are generated from it. Every entry — including the
14 with no codemod — carries `detect`, `apply` and `verify`, so a migration can
be executed without reading 18 KB of prose.

## What this removes

The raw-GitHub-URL delivery path, and with it the self-contained-transform rule,
the composite bundler and `src/composites`. Transform files are renamed to their
dashed catalogue ids.

**Supersedes #2942.** Its transform suite, test harness and migration prose are
adopted here — they were reviewed and green. Its composite bundler is not,
because the CLI runs codemods individually and reports per codemod. Close #2942
rather than merging it: merging it to `main` after this lands would conflict with
every rename.

**URLs printed in already-published `MIGRATION.md` copies now 404.** Accepted:
doc URLs are not covered by the semver contract (ADR 0005), and those consumers
are better served by `npx @mittwald/flow-codemods@latest upgrade`, which works
from any old version.

Not a breaking change under ADR 0005 — the package was `private: true`, so no
published package API changed.

## Out of scope

`packages/ext-bridge/MIGRATION.md` keeps its own hand-written guide. The ~50
lines of import-resolution logic duplicated across the eight transforms could now
be shared, but deduplicating them is a separate change.
BODY
)
```

Add the **`run-visual-tests`** label only if something rendered changed —
nothing here does, so skip it.

---

## Task 15 (follow-up): Catalogue the deprecated APIs that were never written up

**Ships separately from Tasks 0–14.** Its own PR, its own `feat(codemods):`
title, base `next`. Nothing in the CLI depends on it — the machinery is done;
this fills it with the content that gives `upgrade` something to find on the 1.x
line.

**Files:**

- Create: one `packages/codemods/src/migrations/<id>.md` per row below
- Create: `packages/codemods/src/transforms/<id>.ts` + a fixture test, for the
  rows marked codemod
- Modify: `packages/components/MIGRATION.md` (regenerated)

**Interfaces:**

- Consumes: the catalogue schema and generators from Tasks 2–4, `selectEntries`
  from Task 5.
- Produces: catalogue entries only. No new code paths.

**Why this is separate.** Tasks 0–14 _port_ content that already exists in
`MIGRATION.md`, which makes them diff-verifiable: a lost paragraph shows up.
This task _authors_ content that has never been written down, and each entry
needs a `since` that is not in the source — for a `deprecation`, `since` is the
version the **replacement** shipped in, which has to come out of `git log` or
`CHANGELOG.md` per API. Mixing that judgement work into a mechanical port would
hide both.

**Why it matters.** The design settled on "breaking **plus** deprecations"
precisely because ADR 0005 §4 lets type-level changes ship in a Patch, so
codemods stay relevant on the 1.x line. Of the two `kind: deprecation` entries
in Tasks 0–14, both already existed in the guide. Without this task, `upgrade`
on the stable line still finds almost nothing — the agreed scope is only half
delivered.

The surface, from the `@deprecated` tags in `packages/components/src` (`flags`,
`Align` and `SegmentedControl` are already covered by ported entries and are not
repeated here):

| Suggested id                              | Deprecated                                              | Replacement                          | Codemod?                                                                                                                                                                                                                                                                       |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `select-on-selection-change-to-on-change` | `Select.onSelectionChange`                              | `onChange`                           | **Yes** — identical signature `(value: Key \| Key[] \| null) => void`, a pure prop rename.                                                                                                                                                                                     |
| `cartesian-grid-to-chart-grid`            | `CartesianGrid`, `CartesianGridProps`                   | `ChartGrid`, `ChartGridProps`        | **Yes** — `CartesianGridProps` is literally `= ChartGridProps`. Component and type rename. `CartesianGrid` carries `@flr-generate all`, so `remotePackage: true`.                                                                                                              |
| `text-area-allow-resize`                  | `TextArea.allowHorizontalResize`, `allowVerticalResize` | `allowResize`                        | **Yes, with care** — two booleans collapse into `boolean \| "horizontal" \| "vertical"`. Map `allowHorizontalResize` → `allowResize="horizontal"`, `allowVerticalResize` → `allowResize="vertical"`, both present → `allowResize`. Skip a non-literal value rather than guess. |
| `item-view-fallback-to-loading-view`      | `ItemView.fallback`                                     | `loadingView`                        | **Investigate** — same `ReactElement` type, but it is a property on a builder-model object, not a JSX prop, so resolving it to Flow is harder than the JSX cases. Decide from the source; `manual` is an acceptable answer.                                                    |
| `list-loader-async-resource-to-hooks`     | `ListLoaderAsyncResource`                               | `ListLoaderHooks`                    | **Investigate** — check whether the two have the same shape or only the same purpose. A rename onto a different API is the failure a codemod should prevent, not cause.                                                                                                        |
| `icon-status-to-color`                    | `Icon.status`                                           | `color`                              | **No** — `Status` and the colour union are different types. A rename would produce values `color` does not accept. Manual, with the value mapping spelled out in `apply`.                                                                                                      |
| `password-creation-field-validation-hook` | `generatePasswordCreationFieldValidation`               | `usePasswordCreationFieldValidation` | **No** — a function becomes a hook, so call sites must satisfy the rules of hooks. Not decidable from the call alone.                                                                                                                                                          |
| `nextjs-link-to-router-provider`          | `nextjs` `Link`, `LinkProvider`                         | `RouterProvider`                     | **No** — a structural change, not a rename.                                                                                                                                                                                                                                    |
| `cartesian-chart-empty-view-props`        | `CartesianChartEmptyViewProps`                          | a plain `ReactNode`                  | **No** — check first whether this folds into the ported `cartesian-chart-empty-view` entry (`0.2.0-alpha.676`) instead of getting its own.                                                                                                                                     |

- [ ] **Step 1: Establish `since` for each row**

For every API, find the version its **replacement** shipped in — not the version
the old one was deprecated in. The gate for a `deprecation` is
`since <= target`, so a `since` that is too early offers a codemod against an
API the consumer does not have yet.

```bash
git log --oneline --reverse -S 'allowResize' -- packages/components/src/components/TextArea
git tag --contains <commit> | head -1
```

Record the finding in the entry body, not just the frontmatter — the next person
should not have to redo the archaeology.

- [ ] **Step 2: Author the entries, `kind: deprecation`**

Full frontmatter per Task 2's schema. `detect` matters more here than for a
`migration`: the old path still works, so nothing fails to tell a consumer they
are affected. A `detect` that under-matches means the deprecation is silently
missed.

- [ ] **Step 3: Verify the two clean renames against the export surface**

Run: `pnpm nx test:unit codemods -- src/tests/remoteScope.test.ts` Expected:
PASS. `CartesianGrid` is `@flr-generate`, so `remotePackage: true`; `Select`
needs checking rather than assuming.

- [ ] **Step 4: Write the codemods for the rows marked Yes**

One `src/transforms/<id>.ts` each, modelled on
`select-on-selection-change-to-on-change`'s nearest neighbour —
`action-prop-to-on-action` is the same shape (a prop rename resolved through the
Flow import). Each gets a fixture test in `src/tests` and an idempotency case.

For `text-area-allow-resize`, add fixture cases for: only horizontal, only
vertical, both present, and a non-literal value that must be left untouched.

- [ ] **Step 5: Decide the three "Investigate" rows and record the decision**

Whatever the answer, the entry ships with `action` set and the reason in its
body. "No codemod because X is not decidable from the source" is a useful thing
for the next reader to know — the alternative is someone re-opening the question
every year.

- [ ] **Step 6: Regenerate and verify**

```bash
pnpm nx build codemods
git diff packages/components/MIGRATION.md
pnpm nx test:unit codemods && pnpm nx test:compile codemods
pnpm lint
```

Expected: the new entries appear in the guide at their `since` position, all
suites green, no format drift.

- [ ] **Step 7: Check that `upgrade` now finds them**

```bash
node packages/codemods/dist/cli.js list --from 1.0.0 --to 1.0.2
```

Expected: the new deprecation entries appear — where before this task the same
range returned nothing. That is the whole point of the task, so verify it rather
than assuming it.

- [ ] **Step 8: Commit and open the PR**

```bash
git add -A packages/codemods packages/components/MIGRATION.md
git commit -m "feat(codemods): catalogue the deprecated APIs that had no guide entry"
```

PR title:
`feat(codemods): catalogue the deprecated APIs that had no guide entry`, base
`next`.

---

## Verification

The full gate, from the repository root:

```bash
pnpm build && git diff --exit-code
pnpm lint
pnpm nx test:unit codemods
pnpm nx test:compile codemods
```

The codemods suite spawns the real jscodeshift CLI on a temp copy per case. That
is deliberate and must not be "optimised" into an in-process call: it is the
invocation the CLI itself makes. The 60 s `testTimeout` exists because of it.

## Self-review notes

Checked against the agreed design:

- **Delivery, publish, `bin`** — Task 1. **URL path retired** — Task 4.
- **Dashed ids, no aliases** — Tasks 2 and 4.
- **Both gates** — Task 5, with the prerelease and `next`-line cases pinned.
- **`revision` semantics incl. prerelease exclusion and stale dist-tag** —
  Task 6.
- **Lockstep bump, range-operator preservation, conservative current-version
  fallback** — Task 7.
- **bump → install → codemods, install ordering asserted** — Task 12 Step 1,
  test 2.
- **`-y`, non-TTY implication, dirty-tree guard** — Tasks 8 and 12.
- **Manual entries reported at the end** — Task 12, test 8.
- **Catalogue covers all 22 entries incl. the two pre-`0.2.0`** — Task 3.
- **`detect`/`apply`/`verify` on every entry** — Task 3, enforced by Task 2's
  invariants.
- **`MIGRATION.md` generated, drift impossible** — Task 3, gated in Task 13.
- **`to-remote-package` gets a home instead of a named test exception** —
  Task 4.
- **nx cross-project output verified, not assumed** — Task 13.
- **Helper deduplication deliberately excluded** — stated in the design table
  and the PR body.

Two corrections made after the first draft:

- **PR #2942 is adopted, not awaited** (Task 0). Its four added transforms, its
  rewritten `flowAlphaAlignToCombine.ts` (+155/−38 for alias and namespace
  resolution), its test harness, `remoteScope.ts`, and the migration prose it
  added to `MIGRATION.md` all come across. Its composite bundler does not.
- **The agreed "plus deprecations" scope was missing** from the first draft: all
  22 ported entries come from the existing guide, and only two are
  `kind: deprecation` — both already documented. Task 15 adds the deprecated
  APIs that were never written up, which is what makes `upgrade` useful on the
  1.x line.

Two things this plan decides that the brainstorm left open, both stated inline
where they land:

- **The anchor package for version resolution** is the first Flow dependency
  found in the manifest, not a hardcoded `flow-react-components` — a consumer
  may only have `ext-bridge`. Fixed versioning makes any of them a valid anchor
  (Task 12 Step 3).
- **`kind: "tool"`** is added as a third `MigrationKind` so `to-remote-package`
  has a documented home rather than a by-name exception in `documented.test.ts`
  (Task 4 Step 4).
