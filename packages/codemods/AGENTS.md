# Codemods

jscodeshift transforms that migrate consumer code across a breaking change, plus
the `@mittwald/flow-codemods` CLI that runs them.

## Layout

| Path                                                             | What it holds                                                                                                                                                                                                    |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/migrations/<id>/entry.md`                                   | The catalogue. One directory per migration, `entry.md` holding its frontmatter plus prose body. **The source.**                                                                                                  |
| `src/migrations/<id>/transform.ts`                               | The jscodeshift transform, only for entries with `action: codemod`.                                                                                                                                              |
| `src/migrations/<id>/transform.test.ts`                          | That transform's fixtures, including its idempotency case. Required whenever `transform.ts` exists — see below.                                                                                                  |
| `src/tools`                                                      | Transforms with no catalogue entry, each with a co-located `<name>.test.ts`. Currently only `to-remote-package` — see [Does it apply to the remote package?](#does-it-apply-to-the-remote-package).              |
| `src/catalog`                                                    | Reading, typing and selecting catalogue entries.                                                                                                                                                                 |
| `src/cli`, `src/cli.ts`                                          | The `upgrade`, `list` and single-codemod commands.                                                                                                                                                               |
| `src/resolve`, `src/manifest.ts`, `src/install.ts`, `src/git.ts` | Version resolution, manifest edits, the package-manager install (detection up the tree, `packageManager` pin, corepack bridge — via `package-manager-detector`), and the dirty-working-tree guard for `upgrade`. |
| `src/run`                                                        | Drives jscodeshift's `Runner` in-process (not the CLI binary).                                                                                                                                                   |
| `dev/generate`, `dev/buildTransforms.ts`                         | The three catalogue generators, plus the transforms' CommonJS compile — see [Transforms are compiled](#transforms-are-compiled-and-that-is-not-optional).                                                        |
| `src/tests`                                                      | Cross-cutting tests: catalogue invariants, remote-scope checks, the transform-test-coverage guard, and `runTransform`, the run-through-the-real-CLI helper every fixture test uses.                              |

The directory **is** the id — it appears once, instead of once per filename
spread across three separate directories. A migration with no codemod is a
directory holding only `entry.md`.

## The catalogue is the single source of truth

Every migration — codemod or not — is one Markdown file,
`src/migrations/<id>/entry.md`, frontmatter plus a prose body.
`src/catalog/types.ts` defines the schema (`MigrationEntry`);
`src/catalog/read.ts` parses it at build time, taking `id` from the directory
name. `pnpm nx build codemods` turns the catalogue into two generated artifacts:

- `src/migrations.generated.ts` — a typed module the CLI imports at runtime
  (`src/catalog/entries.ts` is the only file that imports it).
- `packages/components/MIGRATION.md` — the consumer-facing guide
  (`dev/generate/migrationGuide.ts`), sorted newest-`since`-first. An entry with
  `kind: "tool"` is left out of the guide — it is not a migration a version
  range selects, so there is nothing to look up there.

Both are committed, like every other generated artifact in this repo — CI fails
on `git diff --exit-code` if you edit the `.md` and forget to rebuild.

## A transform lives beside its catalogue entry

An entry with `action: "codemod"` has exactly one transform:
`src/migrations/<id>/transform.ts`, sibling to that id's `entry.md`.
`src/tests/catalog.test.ts` enforces the correspondence in both directions — a
codemod entry with no transform, or a transform with no matching entry, both
fail. Its internal `Transform` export is named `<camelCaseId>Transform`.

Consumers never install this package by hand — the CLI does, from
`npx @mittwald/flow-codemods@latest`. A single-id invocation
(`npx @mittwald/flow-codemods@latest <id> src`) reads the transform straight out
of the installed package and hands it to jscodeshift's `Runner`, in-process
(`src/run/jscodeshift.ts`). `src/tests/runTransform.ts` takes a different route
on purpose: it spawns the real jscodeshift CLI binary over the transform, an
independent check that it works under jscodeshift's normal invocation — not a
reproduction of `runCodemod`'s invocation, since production and this test helper
no longer call jscodeshift the same way.

### Transforms are compiled, and that is not optional

`package.json` ships `"files": ["dist"]`. The transforms reach a consumer as
**compiled CommonJS** at `dist/migrations/<id>/transform.js`, produced by
`tsconfig.transforms.json` and `dev/buildTransforms.ts` — a second compile
beside the main one, with its own `package.json` marker (`{"type": "commonjs"}`)
written into `dist/migrations` and `dist/tools` so Node does not read the
emitted `.js` as ESM.

The `.ts` sources are **not** published. They used to be, and every codemod died
in every consumer install because of it: jscodeshift's worker `require()`s the
transform path, and although it installs `@babel/register` first,
babel-register's `only` defaults to the current working directory — a transform
under the consumer's `node_modules` is outside it, so babel never claims the
file, Node's own `.ts` handler takes over, and Node refuses with
`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` (no opt-out). In the repo it
worked, because there cwd _is_ inside the package. `src/run/jscodeshift.ts`
prefers the compiled file and keeps the `.ts` as a repo-only fallback;
`src/tests/publishedTransforms.test.ts` loads every compiled transform through
`require` the way the worker does, so a broken or missing compile fails the
build instead of shipping.

A transform may import shared helpers from elsewhere in `src` — they are
compiled along with it. What it must not do is reach anything that stays outside
`dist`.

### The install is detected, not assumed

`src/install.ts` wraps `package-manager-detector` (zero dependencies) for both
detection and command resolution; execution stays ours, because that is where
the test seam (`InstallRunner`, `Probe`), the frozen-lockfile quirks and the
Windows `shell` flag live.

Three things there are load-bearing and easy to undo by accident:

- **Detection walks up.** A workspace package has no lockfile, and detecting in
  `cwd` alone fell through to `npm install` — which dies on a `workspace:*`
  manifest, after `upgrade` already rewrote `package.json`.
- **pnpm gets `--no-frozen-lockfile`, yarn gets
  `YARN_ENABLE_IMMUTABLE_INSTALLS=false`.** `upgrade` just made the lockfile
  stale on purpose, and both managers freeze it themselves when they detect CI.
  The library's `"install"` is the plain install for every agent, so these
  quirks are not something it will hand us.
- **The `packageManager` pin is checked before corepack is used.** Corepack
  ignores `PATH` and downloads into its own cache, so always routing through it
  would send every pinned project — most of them — through a download, offline
  CI included. The comparison is `semver.satisfies`, not a string compare: the
  library reports a `\d+(\.\d+){0,2}` match, so `pnpm@8` yields the pin `"8"`
  against a reported `8.15.0`.

`resolveInvoke` is the same detection used for prose: it decides whether a
printed command says `npx`, `pnpm dlx`, `yarn dlx` or `bun x`. That is why the
bare `list` is no longer manifest-free — a deliberate trade, recorded in the
README.

### Every transform has a test — enforced, not just conventional

A codemod changes files in place, and consumers run them one after another
(`upgrade` runs the catalogue with no lower bound — see the comment on
`selectEntries` in `src/catalog/select.ts`). That is only safe because a second
run over already-migrated code is a proven no-op for every transform.

The proof lives beside the transform: `transform.test.ts` carries the fixture
tests plus a "running it twice changes nothing" case. That alone is not a
guarantee, though — a new transform whose author forgot the test file would
simply never be tested. `src/tests/transformCoverage.test.ts` is the guard: it
scans `src/migrations/*/` directly and fails the moment a `transform.ts` shows
up with no `transform.test.ts` next to it, independent of what any individual
test file claims to do.

## Does it apply to the remote package?

`@mittwald/flow-remote-react-components` mirrors the component API, so most
codemods apply there too — but only most. Its surface is three things: one
module per `@flr-generate` component, the react-hook-form entry, and — the easy
one to miss — **the whole `flr-universal` entry of the main package**, which
`FlowRemoteUniversal.ts` re-exports wholesale. That last one carries `Action`,
`Modal`, the overlay hooks and their prop types, none of which are generated
remote components.

What is not in there: prop types outside that universal set, error classes, and
six of the main package's nine entries.

**A transform may scope itself to the remote package (`remotePackage: true` in
its entry) exactly when something it targets exists there.** Claiming it anyway
is at best noise that reads as coverage, and at worst a rewrite onto a name the
package does not have — which is the failure a codemod is supposed to remove,
not cause.

Don't decide this by hand. `src/tests/remoteScope.test.ts` checks
`remotePackage` two ways: against the remote package's real export surface (a
hand-maintained `targets` list per entry, checked against what the remote
package actually exports), and against the transform's own `flowPackages`
scoping array, read straight from its source by `declaredPackages()`. Both have
to agree with the frontmatter, or `remotePackage` is a second guess instead of
something derived.

`to-remote-package` is the one transform this does not apply to: it ports an app
from `@mittwald/flow-react-components` onto the remote package, so there is no
catalogue entry (no version range calls for it — it is run deliberately, not as
part of an upgrade) and no `remotePackage` flag to check. It lives in
`src/tools` rather than `src/migrations` for exactly that reason: there is no
migration directory to put it beside. `runCodemod` and `runTransform` both fall
back to `src/tools` for an id that names no migration, so it is still runnable
by id like any other transform.

## `since` on a feature branch: write `UNRELEASED`

`since` names the version the change shipped in. On `next` you cannot know it.

A `feat:` PR is promoted later, in a bundle whose stable `x.y.0` depends on what
else is promoted with it — so guessing `1.3.0` is wrong the moment the bundle
changes, and writing `>=1.3.0-next.7` names a channel no `latest` consumer can
find themselves in. Write the literal placeholder instead:

```yaml
since: UNRELEASED
```

`/prepare-release` rewrites it to the graduated version while it builds the
release branch (`pnpm release:resolve-unreleased`, then a regeneration), and a
guard there hard-stops the promotion if one survives (#2890). Nothing else has
to happen in your PR — the catalogue builds, the guide renders "Since
`UNRELEASED` — ships in the next stable release", and the CLI treats the entry
as newer than every real version (`src/catalog/unreleased.ts`; `semver` throws
on the literal, so every comparison routes through `compareSince` /
`isUnreleased`).

**The placeholder is `next`-only.** A `fix:` PR on `main` names its version the
way it always did — the last published one, `>=` the next patch — because that
path is released by `publish.yml`, which does not run `/prepare-release` and
resolves nothing. A placeholder on `main` forward-merges into `next` and gets
resolved by the next promotion, under a version much later than the one it
shipped in.

The same convention covers `packages/ext-bridge/MIGRATION.md`, which is
hand-written and keyed by a level-2 heading naming both versions. Write the
placeholder in both slots:

```md
## From version `UNRELEASED` to `UNRELEASED`
```

Multiple such sections in one release collapse into a single heading, their
bodies concatenated in document order.

## Adding a migration

1. `src/migrations/<id>/entry.md` — frontmatter plus a prose body. Model it on a
   neighbour; `src/catalog/read.ts` validates the required fields. On a `feat:`
   PR into `next`, `since` is `UNRELEASED` — see
   [`since` on a feature branch](#since-on-a-feature-branch-write-unreleased).
2. If `action: "codemod"`: `src/migrations/<id>/transform.ts`, modelled on a
   neighbour. Scope it narrowly — resolve the component through its Flow import
   (named, aliased and namespace), and skip what you cannot decide from the
   source.
3. `src/migrations/<id>/transform.test.ts` — fixture tests plus a "running it
   twice changes nothing" case (`runTransform` runs the real CLI on a temp copy,
   so the test covers the consumer's path, not just the function).
   `src/tests/transformCoverage.test.ts` fails the build if this file is
   missing.
4. Add the entry to `targets` in `src/tests/remoteScope.test.ts` — **every**
   catalogue id has to be listed there, not just the remote-capable ones, or the
   "every entry is listed" test fails. List the names the migration targets and
   set `remotePackage: true` when they exist in the remote package; use `[]` and
   add the id to `notNameScoped` when the entry is about the package layout
   rather than names in it (as `imports-to-package-root` and
   `renamed-css-export` are).
5. `pnpm nx build codemods` and commit the regenerated
   `src/migrations.generated.ts` and `packages/components/MIGRATION.md`.

## Commands

```shell
pnpm nx build codemods        # generators + tsc + the transforms' CommonJS compile
pnpm nx test:unit codemods    # catalogue + fixture + idempotency + published-load tests
pnpm nx test:compile codemods # tsc --noEmit

# Release-time only, run by /prepare-release — not part of a normal PR:
pnpm release:check-unreleased                                  # the guard
pnpm release:resolve-unreleased --current 1.1.10 --target 1.2.0 # the rewrite
```
