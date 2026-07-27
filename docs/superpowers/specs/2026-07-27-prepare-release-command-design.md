# Design: `/prepare-release` slash command

- **Date:** 2026-07-27
- **Status:** Approved (design) — implementation pending
- **Related:** RFC [#2711](https://github.com/mittwald/flow/issues/2711)
  (release model — proposed, not yet adopted)

## Purpose

Provide a Claude Code slash command that creates the **promotion / release PR**
(`release/x.y.0 → main`) described by the "prepare release" step of the release
model in RFC #2711.

The command drafts a curated, user-facing changelog from the Conventional
Commits that accumulated on the collection branch, freezes that state on a
release branch, and opens a Draft PR whose body is the single source of truth
for the eventual GitHub release notes. A maintainer then curates the notes by
hand in the PR and merges; CI performs the actual version bump, build, publish,
and GitHub release on merge.

## Prototype framing (important)

The target model is **proposed, not live**. Today:

- there is **no `next` branch**; the repo is on `0.2.0-alpha.*`,
- publishing runs from `publish.yml` via lerna-lite with
  `--conventional-prerelease`.

This command is therefore built **against the planned model** as a
prototype/preparation that becomes effective once the team establishes the
`main` / `next` branches. The command text may describe the planned model even
though the branches do not yet exist. To stay runnable and testable today, the
source/target branches are overridable via arguments.

## Ownership (decision C — hybrid)

The command owns everything that is side-effect-light and can run from a
developer machine; CI owns everything that mutates versioned release state.

| Responsibility                              | Owner        |
| ------------------------------------------- | ------------ |
| Compute target version                      | command      |
| Collect raw commits, draft curated notes    | command      |
| Create + push freeze branch `release/x.y.0` | command      |
| Open Draft PR `release/x.y.0 → main`        | command      |
| `lerna version` (version commit)            | CI, on merge |
| Build                                       | CI, on merge |
| Git tags                                    | CI, on merge |
| npm publish (`latest`)                      | CI, on merge |
| Create GitHub release from curated notes    | CI, on merge |

**The command creates no tags, no version commit, no build, and no publish.**

## Repository artifacts

### `.claude/commands/prepare-release.md`

The command itself — a prompt with frontmatter (`description`, `argument-hint`).
Modeled on `.claude/commands/review-flow.md`. Arguments are **free-text** (the
command is a prompt, not a CLI); the `argument-hint` documents examples:

- `--from <branch>` (default `next`), `--to <branch>` (default `main`) —
  override source/target for prototype/testing against other branches.
- `--version <x.y.0>` — explicit override when the graduation calculation is
  wrong.

### `.claude/templates/release-notes.md`

Versioned format template for the curated notes. Authoring rules live in the
file as an HTML comment block (single source of truth for both format and
rules). Claude drafts into this shape; the maintainer edits.

Structure (minor/major promotions only — patches release separately, so there is
**no Fixes section**):

```
# {{ Punchy one-line headline }}
## Highlights            (3–6 user-facing bullets)
## Deprecations          (appears in minors too; delete if none)
## {{ Feature name }}     (one section per notable feature, repeat)
## Migrations            (MAJOR releases only — delete for a minor)
```

Details:

- **Headline** lives only in the body (`#` first line). The GitHub release
  **title stays the version/tag** — the headline is not the title.
- **Deprecations** sits near the top (right after Highlights) because in Flow
  deprecations (via `useWarnDeprecation`) are the primary
  breaking-change-avoidance mechanism and appear in minors.
- **No `## What's new` wrapper** — each feature is a top-level `##` section so
  features are siblings of Highlights/Deprecations/Migrations rather than
  nesting under Deprecations.
- **Screenshots** are honest maintainer placeholders. Claude does **not**
  fabricate component screenshots; it may embed existing image URLs and writes
  `tsx` usage examples grounded in the real component API.
- Editorial rules (in the comment block): user-facing prose not commit subjects;
  drop noise entirely (chore/deps/release bumps, internal refactors, CI); group
  by feature/area never by commit; link the PR(s) behind each feature; delete
  the authoring comments and every unused/empty section in the final text.

## Command flow

1. **Parse arguments** (free-text `--from` / `--to` / `--version`) → defaults
   `next` / `main`.
2. **`git fetch`**, computing everything against `origin/*`, not the local
   working state. If the resolved source branch (default `next`) does not exist
   on `origin`, stop and explain that the model may not be live yet and that the
   maintainer must pass `--from`/`--to` overrides.
3. **Version-independent preconditions:**
   - **Hard-stop (abort, explain why):**
     - source has no commits ahead of target (nothing to release).
   - **Warn + confirm (show the problem, ask whether to proceed):**
     - working tree dirty,
     - forward-merge behind (target has commits not on source),
     - CI on source (`next`) is not green — warn rather than hard-stop because
       this repo has known flaky cases (Linux-gated visual snapshots, fake-timer
       races).
4. **Determine target version** — strip `-next.N` (prerelease id) from the
   `origin/next` version; if not unambiguously determinable, fall back to
   recomputing the bump from Conventional Commits in `main..next`; `--version`
   overrides everything.
5. **Version-dependent preconditions** (now that `x.y.0` is known):
   - **Hard-stop (abort, explain why):**
     - a `release/*` branch or open release PR for the same version already
       exists,
     - the computed `x.y.0` already exists as a git tag / npm version.
6. **Collect raw material** — Conventional Commits `main..next`, grouped by
   type, with PR links and a commit count.
7. **Draft curated notes** — strictly following
   `.claude/templates/release-notes.md`.
8. **Preview + confirm** — show the full PR body preview and ask before any
   push.
9. **Freeze branch** — create `release/x.y.0` from `origin/next` and push it.
10. **Open Draft PR** `release/x.y.0 → main` with the fixed body frame (below).
11. **Summary** — print the PR URL, target version, and the maintainer's next
    steps (curate notes, tick the checklist, mark Draft → Ready, merge).

## PR body frame

Defined in command prose (not a file). Sections:

- **Meta table** — Source → Target, Version (`current → x.y.0`), Bump (type +
  basis).
- **Curated release notes** between the marker comments (see contract below).
- **Maintainer checklist** — notes curated; breaking changes surfaced +
  MIGRATION.md / codemod where needed; target version correct; forward-merge
  state clean.
- **`<details>`** — raw commit list (reference only, not published).

## Marker contract

The curated notes appear **verbatim** between:

```
<!-- release-notes:start -->
… curated notes …
<!-- release-notes:end -->
```

This block is the **single source of truth** for the GitHub release. On merge,
CI reads exactly this block from the PR body and passes it to
`gh release create`. The maintainer edits in one place (the PR); nothing curated
is committed to the repo — the canonical changelog is the GitHub release, while
per-package `CHANGELOG.md` files remain the auto-generated raw log.

The extraction CI performs on merge must tolerate (trim) leading and trailing
blank lines inside the marker block — prettier may insert blank lines adjacent
to the markers, and that whitespace is not content.

## Dependency outside this command (documented, not implemented here)

`publish.yml` must be adapted so that, on merge of a release PR, the release
notes are taken from the **PR body marker block** instead of from the
auto-generated `CHANGELOG.md` (current `awk` extraction), and so that lerna does
**not** regenerate/overwrite the curated text when it creates the release. This
becomes effective when the team establishes `next` / `main`. It is out of scope
for the command implementation but is a required companion change for the model
to work end to end.

## Non-goals

The command does **not**: run `lerna version`, build, create git tags, publish
to npm, or create the GitHub release. All of that remains CI's job on merge.
