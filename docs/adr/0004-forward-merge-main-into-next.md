# ADR 0004 – Forward-merge `main` into `next`

- **Status:** Accepted
- **Date:** 2026-07-27 (accepted 2026-07-29)
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** `.github/workflows/` (a new `forward-merge.yml` and a symmetric
  `publish-next.yml`), the `next` branch protection, `.gitattributes`, and the
  release model in [RFC #2711](https://github.com/mittwald/flow/issues/2711)

> This ADR fixes the **mechanics of the forward-merge** — the automatic merge of
> a lower release line into the line above it (`main → next`, and analogously
> `next → major line`) — for the 1.0.0 release model. The model itself is
> accepted in [RFC #2711](https://github.com/mittwald/flow/issues/2711); this
> ADR only specifies _how_ the forward-merge is built. **The design is fixed
> here; the implementation has since landed** in #2753 (`forward-merge.yml`,
> `publish-next.yml`, the `.gitattributes` merge drivers, and `publish.yml`
> moved to the shared `mutate-main` group). It stays inert until the `next`
> branch exists and the repo is off the `0.2.0-alpha.*` line.

## Context

The 1.0.0 model runs two standing lines: `main` (Stable, dist-tag `latest`,
fixes only) and `next` (Collection, dist-tag `next`, `main` + accumulated
features), plus an on-demand major line. The **forward-merge** keeps higher
lines a superset of lower ones **by construction, without cherry-picking**:
every change on `main` is merged up into `next`.

The naive "just merge `main` into `next` on every push" has four traps that make
or break the model:

1. **History shape.** If the merge replays commits (rebase/squash/cherry-pick),
   `main` stops being an ancestor of `next`, and every subsequent forward-merge
   — and the Promotion `next → main` — re-collides with the "same" changes. That
   is exactly the cherry-picking pain the model exists to avoid.
2. **Version churn.** With fixed versioning, `main` and `next` carry _different_
   versions in ~15 `package.json` files plus the `CHANGELOG.md` files. A 3-way
   merge conflicts on every release, which would spawn a maintainer-facing PR
   for every single patch — killing the "unattended" promise.
3. **Concurrent writers.** Once `next` is published continuously, two workflows
   push to it (`forward-merge.yml` and `publish-next.yml`); `main` similarly has
   `publish.yml` and Promotion merges. Un-serialized, they race on
   non-fast-forward pushes.
4. **The Promotion loop.** After a Promotion (`next → main`), the changes must
   flow back to `next` without an infinite loop or a spurious conflict PR.

This ADR decides each of these.

## Decision

### 1. Merge strategy: real merge commits only

The forward-merge is a **true merge commit** (`git merge --no-ff main` on
`next`). No rebase, squash, cherry-pick, or history rewrite — ever.

This makes `main` an **ancestor** of `next` in the git graph. The superset
invariant is then materialized in history: Git knows what is already integrated
and merges only the delta, so routine forward-merges do not re-collide. The cost
— merge-commit noise in `next`'s history — is irrelevant, because the canonical
changelog is the curated GitHub Release, not `next`'s raw history (per RFC
#2711).

### 2. Trigger and location: a dedicated, idempotent, serialized workflow

A new **`.github/workflows/forward-merge.yml`**, triggered on **`push: main`**
**and** on **`workflow_dispatch`** (manual runs, consistent with `publish.yml`).
The manual trigger is a first-class recovery/force path — e.g. to re-run the
sync after a failed automatic run — and is safe precisely because the workflow
is idempotent: a manual run merges the current `main` tip into `next` exactly
like an automatic one. Not a step inside `publish.yml` (separation of concerns:
a failed publish must not block the sync and vice versa), and not
`workflow_run`-chained (needless token/default-branch complexity).

The workflow is **idempotent**: it merges the _current_ `main` tip into `next`,
never "a specific commit". Consequences:

- A `fix:` push and the later `chore(release):` push that `publish.yml` makes
  each trigger a run; both converge on the same target state ("`next` contains
  `main`'s tip"). The double run costs CI time, not correctness.
- It covers **non-releasing** pushes (`docs:`, `ci:`, `chore:`, …) too, because
  it hangs off the branch, not off publish logic.

Runs are serialized (see §5).

### 3. Version / changelog churn: merge drivers, not sync PRs

`next` needs `main`'s **code**, never `main`'s **version number** (`next` has
its own derived version line). The version/changelog conflict is therefore
mechanical noise, not a real conflict, and is resolved automatically via
`.gitattributes` merge drivers:

- **`**/CHANGELOG.md
  merge=ours`** — keep `next`'s changelog; `lerna`regenerates`next`'s entries from the merged commits anyway. Per-package `CHANGELOG.md`
  are only the machine record (RFC #2711), so this loss is inconsequential.
- **`**/package.json`** → a **JSON-aware merge driver** (a small Node script) that, on conflict, keeps the `version`field from`next`while merging all other changes (e.g. genuine dependency bumps from`main`) with the normal 3-way result. A blanket `merge=ours`on`package.json`is rejected — it would silently drop legitimate dependency changes from`main`.

Only a conflict where **both sides touch the same logic line** escalates to a
sync PR (§4). The exact version string produced by the merge is irrelevant — it
is re-derived by `publish-next.yml` (§6).

### 4. Conflict handling: the sync PR

On a real (non-version) conflict, the workflow:

- Creates/updates a dedicated branch **`sync/main-to-next`** at `main`'s tip and
  opens a PR **`sync/main-to-next → next`** (not `head == main` directly —
  conflict-resolution commits must not land on `main`). A maintainer resolves
  the conflict on the sync branch (locally or via the web editor) and merges.
- Applies the **`sync`** label (plus `automated`) and requests review from
  **CODEOWNERS** (the Frontend Core Team) — not a single assignee (bus factor),
  no round-robin (overkill for the team size).
- Is **idempotent**: if a `sync` PR is already open, it only fast-forwards the
  branch to `main`'s tip instead of opening duplicates.

**The sync PR must be merged as a true merge commit** (`main` stays an ancestor
of `next`). Squash/rebase-merging it would reintroduce trap #1. This is enforced
by branch protection on `next` (see §5), consistent with §1.

### 5. Concurrency and branch protection

**One shared `concurrency` group per target branch**, used by _every_ workflow
that pushes to it — `mutate-main`, `mutate-next`, `mutate-major` — each with
`cancel-in-progress: false`. This serializes all writers of a branch against
each other and removes the non-fast-forward races by design. (`publish.yml` now
uses this shared `mutate-main` group.) As a belt-and- suspenders, each mutating
job does **fetch-before-push with one retry** (on non-fast-forward:
`git fetch` + re-merge + re-push).

**`next` is protected** (real-merge-commit-only for human PRs, direct pushes
restricted), **with the automation identity as a bypass actor** for direct
pushes. Humans go through a PR + merge commit; the bot pushes directly on the
clean path (its pushes _are_ merge commits, so the invariant holds). The bypass
must **not** waive the merge-method restriction for real PRs — only the
direct-push block.

### 6. Interaction with `publish-next.yml` (the re-publish)

A forward-merged fix **produces a new `next` prerelease** so that `flow@next` ⊇
`flow@latest` on npm, not merely in git. This falls out for free:

- The forward-merge stays **version-free** — it merges and pushes, nothing more.
- The push to `next` triggers a **symmetric `publish-next.yml`** (`push: next`,
  analogous to `publish.yml`) that runs
  `lerna version --conventional-prerelease` → `X.Y.0-next.N+1` → publishes
  dist-tag `next`. This re-derives the version, so the string the merge driver
  (§3) produced is irrelevant.

Because of idempotency (§2): the `fix:` push carries real code delta → `next`
re-publishes; the later `chore(release):` push carries only version/changelog
churn the driver absorbs → an **empty merge, no push, no second publish**. The
double trigger collapses to exactly one meaningful publish.

### 7. The Promotion loop

The back-merge after a Promotion needs **no special mechanism**. A Promotion is
a `next → main` merge; the resulting push to `main` triggers the normal
`forward-merge.yml`. Since the Release-PR merge commit has `next`'s tip as a
parent, `next` is already an ancestor of `main`; the back-merge brings only the
`chore(release): graduate to X.Y.0` churn, which the driver (§3) absorbs → an
empty merge, no push, no loop.

A `fix:` landing mid-Promotion is safe by idempotency (§2): regardless of the
order of fix-push, Promotion merge, and forward-merge run, every run merges the
current `main` tip and all states converge on "`next` ⊇ `main`".

### 8. Merge-commit message and commitlint

The forward-merge uses an **explicit conventional message**, not git's default:

```
git merge --no-ff -m "chore(sync): forward-merge main into next (<short-sha>)"
```

- It passes any commitlint check (`chore(sync):` is valid-conventional).
- `chore` is **non-releasing** → it triggers no unwanted bump on `next`; the
  actual version is derived by `lerna` from the merged `fix:` commit.
- It is greppable/auditable, rather than relying on commitlint's "starts with
  `Merge`" `defaultIgnores` heuristic.

The clean path stays **PR-free** (direct push), so it never runs the PR-bound
commitlint guard. Only the sync PR (§4) runs it — where `main`'s commits were
already linted on their way into `main`, and merge commits are ignored by
`defaultIgnores`.

**Interface note (belongs to the routing guard, not this ADR):** the Promotion
Release-PR `next → main` is full of `feat:` commits. The RFC #2711 routing guard
("reject `feat:` on PRs to `main`") **must exempt** the case `head == next` (or
a major line), or it would block the Promotion itself. Recorded here so the two
designs fit together.

### 9. Implementation vehicle and permissions

**Self-built**, a lean workflow of `git` + the `gh` CLI (consistent with the
existing workflows and the repo convention of using `gh` for GitHub). No
off-the-shelf "forward-merge" action: the requirements — JSON-aware
`package.json` driver, sync-PR idempotency, the `chore(sync):` message,
fetch-before-push retry, shared concurrency — would not be covered, and a
third-party action on a release-critical path is not worth the dependency.

The workflow reuses the existing **`PUBLISH_PAT`** bot identity (already
established in `publish.yml` with `contents: write`) as the branch-protection
bypass actor on `next`. No new GitHub App is introduced for now.

### 10. Failure handling (non-conflict failures)

A **conflict** produces a sync PR (§4) — that is the expected, non-error path. A
**non-conflict failure** (fetch-before-push retry exhausted, an error in the
workflow itself, a failing generator) is different: the workflow **opens an
issue and pings CODEOWNERS**, so a silently-failing sync cannot let `next`
quietly fall behind `main`.

### 11. The major line

The `next → major line` forward-merge uses the **same mechanism** — same merge
strategy, drivers, concurrency group (`mutate-major`), sync-PR flow, and message
convention — only with different branch names. It is not designed separately.

## Consequences

**Positive**

- The superset invariant is a structural property of the git graph, not a
  convention a human maintains — routine forward-merges never re-collide.
- The common case (version/changelog churn on every release) resolves
  automatically; only genuine code conflicts reach a human, preserving the
  "unattended" promise.
- `flow@next` is an honest superset of `flow@latest` on npm, not just in git.
- The Promotion loop needs no bespoke logic; idempotency makes ordering races a
  non-issue.
- No third-party action on the release-critical path; built from `git`/`gh` like
  the rest of the CI.

**Negative / trade-offs**

- `next`'s history accumulates `chore(sync):` merge commits (accepted — the
  curated GitHub Release is canonical).
- Every fix produces two publishes (a `latest` patch **and** a `next`
  prerelease), plus a major-line prerelease when that line exists — more npm
  noise, in exchange for honest superset semantics.
- A custom JSON-aware merge driver is a small piece of bespoke tooling to
  maintain and to install in CI checkouts (it must be registered in the runner's
  git config, not only in `.gitattributes`).
- Branch protection with an automation bypass actor is a standing configuration
  that must be kept correct (bypass for direct pushes only, never for the
  merge-method restriction).

## Follow-ups (not part of this ADR)

**Landed** in #2753:

- `forward-merge.yml`, the `.gitattributes` merge drivers + the JSON merge
  driver script (`.github/scripts/merge-package-json.cjs`), and the shared
  per-target-branch `concurrency` groups; `publish.yml` moved to `mutate-main`.
- The symmetric `publish-next.yml` (`push: next` → dist-tag `next`).

**Still pending** — gated on the 1.0.0 cut (`next` established, repo off the
`0.2.0-alpha.*` line):

- Configure `next` (and, on demand, the major line) branch protection with the
  `PUBLISH_PAT` bot as the direct-push bypass actor.
- The routing-guard `head == next`/major-line exemption (§8) — tracked with the
  guard in RFC #2711.
- Until `next` exists the cascade stays inert: `forward-merge.yml` triggers on
  `main` pushes but has no `next` to merge into, and the version-contract guard
  is dormant (see ADR 0005).
