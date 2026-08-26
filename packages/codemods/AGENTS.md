# Codemods

jscodeshift transforms that migrate consumer code across a breaking change. Each
one is referenced from the matching entry in
[components/MIGRATION.md](../components/MIGRATION.md), with the ready-made call.

## The one rule: a transform must run standalone

Consumers never install this package. They point jscodeshift at a raw GitHub
URL:

```shell
npx jscodeshift \
  -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/main/packages/codemods/src/transforms/<name>.ts \
  --parser tsx \
  src
```

jscodeshift downloads that URL into a file in the OS temp dir and requires it
from there. A relative import then resolves against the temp dir, where no
sibling file exists, and the run dies with `MODULE_NOT_FOUND` — while working
fine in this repo.

**So every file in `src/transforms` must be self-contained.** Its only import is
`import type { Transform } from "jscodeshift"`, which is erased before the file
runs. `src/tests/standalone.test.ts` enforces this by running each transform the
way a consumer does: copied alone into a temp directory.

## Layout

| Path             | What it holds                                                             |
| ---------------- | ------------------------------------------------------------------------- |
| `src/transforms` | What consumers fetch. Self-contained. `flowAlphaAll.ts` is **generated**. |
| `src/composites` | Transforms that compose others. Source only — never fetched directly.     |
| `dev`            | The bundler that turns a composite into a self-contained transform.       |
| `src/tests`      | Fixture tests, all running through the real jscodeshift CLI.              |

`flowAlphaAll` runs every `0.2.0-alpha` migration in one pass, so it does need
the others. `pnpm nx build codemods` inlines them into
`src/transforms/flowAlphaAll.ts`, which is committed like every other generated
artifact in this repo. Edit `src/composites/flowAlphaAll.ts`, then regenerate —
CI fails on a stale bundle.

The bundler is strict on purpose: it understands exactly the shape every
transform has (one type-only `jscodeshift` import, one top-level declaration,
one `export default <identifier>`) and throws on anything else rather than
emitting a bundle that silently drops code.

## Adding a transform

1. `src/transforms/<name>.ts`, self-contained, modelled on a neighbour. Scope it
   narrowly: resolve the component through its Flow import (named, aliased and
   namespace), and skip what you cannot decide from the source.
2. A fixture test in `src/tests`. `runTransform` runs the real CLI on a temp
   copy, so the test covers the consumer's path, not just the function.
3. The call in the matching `MIGRATION.md` entry.
4. Part of the `0.2.0-alpha` series? Add it to `src/composites/flowAlphaAll.ts`
   in release order and run `pnpm nx build codemods`.

## Commands

```shell
pnpm nx build codemods        # regenerate the composite bundles
pnpm nx test:unit codemods    # fixture + standalone tests
pnpm nx test:compile codemods # tsc --noEmit
```
