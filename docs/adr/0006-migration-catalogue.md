# ADR 0006 – Migration catalogue and the `upgrade` CLI

- **Status:** Accepted
- **Date:** 2026-08-27
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** `packages/codemods` (now published as `@mittwald/flow-codemods`),
  `packages/components/MIGRATION.md` (now generated), and every consumer
  following a migration link from an already-published `MIGRATION.md`

## Context

Consumer migrations lived only as prose in `packages/components/MIGRATION.md`. A
codemod, when one existed, was invoked by pointing `jscodeshift` at its raw file
URL on `main`:

```shell
npx jscodeshift -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/main/packages/codemods/src/transforms/<name>.ts --parser tsx src
```

Two problems with that path:

1. **The guide was hand-written and not machine-readable.** Nothing but a human
   eye connected a version range to the codemods it needed, or told an agent
   whether a change without a codemod even had one.
2. **The URL invocation had no version.** It always ran the transform on `main`,
   regardless of which version the consumer's code predates — as `main` moves,
   an old URL can silently start doing the wrong thing.

## Decision

**The migration catalogue (`packages/codemods/src/migrations/<id>/entry.md`) is
the single source for consumer migrations.** One Markdown file per migration,
frontmatter plus prose. `packages/components/MIGRATION.md` is generated from it;
editing the guide by hand is futile — CI fails the diff.

**Every entry carries `apply`** — one imperative instruction — whether or not it
has a codemod, plus a codemod where the change is mechanically decidable. That
is what makes an entry without a codemod actionable at all: of the 22 ported
entries, 13 have none and previously offered nothing but a section of guide
prose to read.

**`@mittwald/flow-codemods` is published as a CLI**, which is what lets
`upgrade` exist:

- `flow-codemods upgrade [revision]` bumps every Flow dependency to a resolved
  target, installs, runs every codemod up to that target, and lists the
  migrations with no codemod at the end. Deliberately no lower bound: nothing
  records which migrations a project has already performed, and re-running a
  codemod is a no-op every transform is tested for.
- `flow-codemods list [revision] [--json]` prints the whole catalogue offline,
  or — with a revision — exactly the range `upgrade` would touch, without
  changing anything.
- `flow-codemods <id> [path]` runs one codemod by its catalogue id.

This **retires the raw-GitHub-URL delivery path**. A codemod is no longer
invoked by URL; it ships inside the published package and the CLI resolves which
ones apply.

## Consequences

**Positive**

- One source instead of two (guide prose and codemod links) that could drift
  apart.
- A migration without a codemod is still actionable, because `apply` states the
  change as one instruction instead of leaving an agent to find and read the
  right guide section.
- `upgrade` gives consumers a single command that installs the right version and
  runs the codemods for it — no more picking a transform URL by hand and hoping
  it matches their version.

**Negative / accepted cost**

- **URLs printed in already-published `MIGRATION.md` copies now 404.** Doc URLs
  are not covered by [ADR 0005](0005-semver-contract.md)'s semver contract, and
  those consumers are better served by
  `npx @mittwald/flow-codemods@latest upgrade` anyway — it works from any old
  version, because `npx` always fetches the current CLI rather than replaying a
  stale URL.

## Non-goals

- **Executable `detect` and `verify` fields.** An earlier draft of this change
  gave every entry runnable detection and verification modules, with `detect`
  and `verify` CLI commands over them, and it was built before being cut. Two
  reasons it went: the checks were not dependable enough to gate a migration on,
  and reducing them to prose told an agent nothing it could not already read
  from `apply`. What remains is `apply` plus a codemod where the change is
  mechanically decidable. Worth revisiting only with checks that actually hold.
- `packages/ext-bridge/MIGRATION.md` keeps its own hand-written guide. It is not
  part of the catalogue and is not generated.
