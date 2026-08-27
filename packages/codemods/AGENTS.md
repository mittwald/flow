# Codemods

jscodeshift transforms that migrate consumer code across a breaking change, plus
the `@mittwald/flow-codemods` CLI that runs them.

## The catalogue is the single source of truth

Every migration — codemod or not — is one Markdown file in `src/migrations`,
frontmatter plus a prose body. `src/catalog/types.ts` defines the schema
(`MigrationEntry`); `src/catalog/read.ts` parses it at build time.
`pnpm nx build codemods` turns the catalogue into two generated artifacts:

- `src/migrations.generated.ts` — a typed module the CLI imports at runtime
  (`src/catalog/entries.ts` is the only file that imports it).
- `packages/components/MIGRATION.md` — the consumer-facing guide
  (`dev/generate/migrationGuide.ts`), sorted newest-`since`-first. An entry with
  `kind: "tool"` is left out of the guide — it is not a migration a version
  range selects, so there is nothing to look up there.

Both are committed, like every other generated artifact in this repo — CI fails
on `git diff --exit-code` if you edit the `.md` and forget to rebuild.

## `src/transforms` mirrors the catalogue

An entry with `action: "codemod"` has exactly one file:
`src/transforms/<id>.ts`, named for the catalogue id.
`src/tests/catalog.test.ts` enforces the correspondence in both directions — a
codemod entry with no transform, or a transform with no matching entry, both
fail. Its internal `Transform` export is named `<camelCaseId>Transform`.

Consumers never install this package by hand — the CLI does, from
`npx @mittwald/flow-codemods@latest`. A single-id invocation
(`npx @mittwald/flow-codemods@latest <id> src`) reads the transform straight out
of the installed package and hands it to jscodeshift;
`src/tests/runTransform.ts` reproduces that exact invocation for tests, spawning
the real jscodeshift CLI rather than calling the transform in-process.

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

## Adding a migration

1. `src/migrations/<id>.md` — frontmatter plus a prose body. Model it on a
   neighbour; `src/catalog/read.ts` validates the required fields.
2. If `action: "codemod"`: `src/transforms/<id>.ts`, modelled on a neighbour.
   Scope it narrowly — resolve the component through its Flow import (named,
   aliased and namespace), and skip what you cannot decide from the source.
3. A fixture test in `src/tests` (`runTransform` runs the real CLI on a temp
   copy, so the test covers the consumer's path, not just the function) plus an
   idempotency fixture in `src/tests/idempotency.test.ts`.
4. If the migration also applies to the remote package: add its `targets` to
   `src/tests/remoteScope.test.ts` and set `remotePackage: true`.
5. `pnpm nx build codemods` and commit the regenerated
   `src/migrations.generated.ts` and `packages/components/MIGRATION.md`.

## Commands

```shell
pnpm nx build codemods        # regenerate the catalogue's generated artifacts
pnpm nx test:unit codemods    # catalogue + fixture + idempotency tests
pnpm nx test:compile codemods # tsc --noEmit
```
