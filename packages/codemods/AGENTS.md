# Codemods

jscodeshift transforms that migrate consumer code across a breaking change, plus
the `@mittwald/flow-codemods` CLI that runs them.

## Layout

| Path                                                             | What it holds                                                                                                                                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/migrations/<id>/entry.md`                                   | The catalogue. One directory per migration, `entry.md` holding its frontmatter plus prose body. **The source.**                                                                                     |
| `src/migrations/<id>/transform.ts`                               | The jscodeshift transform, only for entries with `action: codemod`.                                                                                                                                 |
| `src/migrations/<id>/transform.test.ts`                          | That transform's fixtures, including its idempotency case. Required whenever `transform.ts` exists — see below.                                                                                     |
| `src/tools`                                                      | Transforms with no catalogue entry, each with a co-located `<name>.test.ts`. Currently only `to-remote-package` — see [Does it apply to the remote package?](#does-it-apply-to-the-remote-package). |
| `src/catalog`                                                    | Reading, typing and selecting catalogue entries.                                                                                                                                                    |
| `src/cli`, `src/cli.ts`                                          | The `upgrade`, `list` and single-codemod commands.                                                                                                                                                  |
| `src/resolve`, `src/manifest.ts`, `src/install.ts`, `src/git.ts` | Version resolution, manifest edits, package-manager install, and the dirty-working-tree guard for `upgrade`.                                                                                        |
| `src/run`                                                        | Drives jscodeshift's `Runner` in-process (not the CLI binary).                                                                                                                                      |
| `dev/generate`                                                   | The three generators.                                                                                                                                                                               |
| `src/tests`                                                      | Cross-cutting tests: catalogue invariants, remote-scope checks, the transform-test-coverage guard, and `runTransform`, the run-through-the-real-CLI helper every fixture test uses.                 |

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

A transform no longer has to be self-contained — it may import shared helpers
from elsewhere in `src`. But `package.json` ships
`"files": ["dist", "src/migrations/**/transform.ts", "src/tools/to-remote-package.ts"]`:
the published package carries the transform sources and nothing outside them
(not `entry.md`, not the test files). Anything a transform imports must resolve
inside what ships, or it is missing from the published package even though it
type-checks locally.

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

## Adding a migration

1. `src/migrations/<id>/entry.md` — frontmatter plus a prose body. Model it on a
   neighbour; `src/catalog/read.ts` validates the required fields.
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
pnpm nx build codemods        # regenerate the catalogue's generated artifacts
pnpm nx test:unit codemods    # catalogue + fixture + idempotency tests
pnpm nx test:compile codemods # tsc --noEmit
```
