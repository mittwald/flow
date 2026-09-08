# ADR 0004 – Forward-merge `main` into `next`

- **Status:** Accepted (§4 and §5 amended 2026-08-06, §3 amended 2026-08-26)
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

> **Amendment 2026-08-06 (from the dry-run rehearsal, #2769).** Rehearsing the
> cascade on a scratch fork showed two of the mechanisms below do not behave as
> written. **§5** claimed that a shared `concurrency` group serializes every
> writer of a branch; it does not — GitHub keeps at most one _pending_ run per
> group and evicts it when a newer run arrives, so forward-merge runs are
> dropped rather than delayed. **§4** described a sync PR that a human resolves;
> that cannot work as intended, because GitHub does not run the `.gitattributes`
> merge drivers, so the churn §3 removes reappears on the PR. Both sections are
> corrected in place below; the reasoning and the measurements are recorded on
> #2769.

> **Amendment 2026-08-26 (the `package.json` driver runs everywhere).** §3
> specified the JSON driver as "keep `next`'s `version`", which reads the
> cascade as the only direction it ever sees. It is not: `pnpm install`
> registers the driver in every developer's git config, so it also runs on the
> far more common `main` merged INTO a branch off `main` — where "ours" is the
> fork point, and preferring it **silently reverted the release bump** on
> whichever manifest the branch had touched. Silently, because the driver only
> runs when both sides changed the file, it emits no conflict markers, and the
> package's `CHANGELOG.md` merges cleanly and keeps the new entry — so the
> manifest and the changelog disagree with nothing to show for it. Reproduced
> twice on #2942. §3 now picks the **higher semver** instead, which is correct
> in both directions and unchanged for the cascade, and a version-consistency
> guard backs it up. Corrected in place below.

> **Amendment 2026-08-27 (npm Trusted Publisher).** The **symmetric second
> workflow file is gone.** `publish-next.yml` is merged into `publish.yml`,
> which now serves both lines and derives the line from the run's ref. The
> mechanism below is unchanged — same trigger, same version derivation, same
> dist-tag, same shared `mutate-next` group; only its host file is. Reason:
> npm's Trusted Publisher binds one workflow **filename** per package and allows
> exactly one publisher per package. Every Flow package names `publish.yml`, so
> every publish from `publish-next.yml` was an unauthorized identity — npm
> answered the PUT with `E404 Not found`, for every package, on every attempt.
> Registering the second file is not possible, and moving the job body into a
> reusable workflow does not help either, because npm validates the _calling_
> workflow's name. The `next` line consequently never published a single
> package; nothing had to be repaired, because the release commit is pushed only
> after npm accepts (§6). Read `publish-next.yml` below as "the `next` half of
> `publish.yml`".

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
   push to it (`forward-merge.yml` and `publish.yml`); `main` similarly has
   `publish.yml` and Promotion merges. Un-serialized, they race on
   non-fast-forward pushes.
4. **The Promotion loop.** After a Promotion (`next → main`), the changes must
   flow back to `next` without an infinite loop or a spurious conflict PR.

This ADR decides each of these.

## Decision

### 1. Merge strategy: real merge commits only

The forward-merge is a **true merge commit** (`git merge --no-ff main` on
`next`). No rebase, squash, cherry-pick, or history rewrite — ever.

This materializes the superset invariant in history: Git knows what is already
integrated and merges only the delta, so routine forward-merges do not
re-collide. The cost — merge-commit noise in `next`'s history — is irrelevant,
because the canonical changelog is the curated GitHub Release, not `next`'s raw
history (per RFC #2711).

**The superset holds for _content_, not for ancestry** — this section previously
claimed `main` becomes an ancestor of `next`, which §6/§7 then contradicts: a
merge carrying no code delta is deliberately dropped, so the `chore(release):`
bump never reaches `next`. In the steady state `main` therefore sits permanently
one commit ahead while being content-identical. Anything that needs to answer
"has `next` fallen behind?" must probe the **merge**, not the ancestry — an
`is-ancestor` test reports drift forever. (Found in the #2769 rehearsal, where
the drift check did exactly that.)

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

- **`**/CHANGELOG.md merge=ours`** — keep `next`'s changelog;
  `lerna`regenerates`next`'s entries from the merged commits anyway. Per-package
  `CHANGELOG.md` are only the machine record (RFC #2711), so this loss is
  inconsequential.

> **`merge=ours` is written for `main → next` and must not be applied to the
> promotion.** In the other direction it keeps `next`'s changelog, which carries
> the prerelease line interleaved with the stable entries it forward-merged —
> and promoting it **overwrites the stable history on `main`**. The #2769
> rehearsal produced exactly that: `main` came out of a promotion carrying
> `## [2.2.5](compare/2.3.0-next.4...2.2.5)`, a stable release comparing against
> a prerelease of the other line, with its own release bodies hollowed out. That
> file is what `publish.yml` extracts GitHub Release bodies from, so the damage
> reaches users. The promotion therefore takes **`main`'s** changelogs
> (`/prepare-release` restores them after its merge); lerna prepends the
> graduated entry on merge, and the prerelease entries drop out of the record,
> which is correct — they were never published under `latest`.

- **`**/package.json`** (and `lerna.json`, which carries the same field) → a
  **JSON-aware merge driver** (a small Node script) that resolves the `version`
  field to the **higher semver of the two sides** and merges everything else
  (e.g. genuine dependency bumps from `main`) with the normal 3-way result. A
  blanket `merge=ours` on `package.json` is rejected — it would silently drop
  those legitimate dependency changes.

  The driver originally kept `next`'s version, reading the cascade as its only
  caller. It is not: `pnpm install` registers it in every developer's git config
  (see Consequences), so it runs on every merge that touches a manifest —
  overwhelmingly `main` merged INTO a branch off `main`, where "ours" is the
  fork point and preferring it reverts the release bump. **A version only ever
  moves forward on any line**, so the higher side is the right answer in every
  direction:

  | Merge               | Higher side                     | Resolves to |
  | ------------------- | ------------------------------- | ----------- |
  | `main` → `next`     | `X.(Y+1).0-next.N` > `X.Y.Z`    | ours        |
  | `next` → major line | the major line's own prerelease | ours        |
  | `main` → feature    | `main`'s release bump           | theirs      |
  | `main` → next-based | the `next` line                 | ours        |

  For the cascade this is not a behaviour change: `next` is always the higher
  side, so it still wins and §6/§7's empty-forward-merge property holds. Note
  that git consults a driver **only when both sides changed the file** — when
  one side is unchanged it resolves the file without asking anyone.

Only a conflict where **both sides touch the same logic line** escalates to a
sync PR (§4). The exact version string produced by the merge is irrelevant on
the release lines — it is re-derived by `publish.yml` (§6). It is _not_
irrelevant anywhere else, which is why the driver had to become direction-
agnostic, and why `test.yml` runs a **version-consistency guard** on every PR:
under fixed versioning every Lerna-managed package must carry `lerna.json`'s
version, and a manifest left behind by a merge is otherwise invisible until the
wrong version reaches npm.

### 4. Conflict handling: the sync PR

On a real (non-version) conflict, the workflow **opens an issue and stops.** It
creates no branch and no pull request: a PR is a change proposal, and until
someone has resolved the conflict there is nothing to propose.

The resolution happens in a developer checkout, via `pnpm sync:resolve`:

```shell
pnpm sync:resolve             # merges main into next locally
# resolve the conflicts, then:
pnpm sync:resolve --continue  # commits, pushes, opens the PR
```

**This must be local, and that is the load-bearing part.** GitHub does not run
the merge drivers declared in `.gitattributes` — a merge driver only exists in
local git config, which is not versioned. A merge computed on GitHub's side
therefore shows every `version` and `CHANGELOG.md` divergence between the lines
as a conflict, burying the one file that genuinely needs a human under dozens of
mechanical ones (35 conflicting files in the #2769 rehearsal, 34 of them noise).
Locally, with the drivers registered by `pnpm install` (§3), only the genuine
conflict remains. `--continue` refuses to commit while conflict markers are
left.

The pull request `sync/main-to-next → next` appears **after** the resolution and
is therefore a clean, reviewable merge. It carries the **`sync`** label (plus
`automated`) and requests review from **CODEOWNERS** (the Frontend Core Team) —
not a single assignee (bus factor), no round-robin (overkill for the team size).

The escalation issue is closed by the cascade itself, once it observes that
`next` contains `main` again. It cannot be closed by a `Closes #n` in the sync
PR: GitHub only auto-closes linked issues when a PR merges into the **default
branch**, and the sync PR targets `next`.

The escalation is **idempotent**: while a sync issue or a sync PR is open, the
cascade does not open a second one, and it never touches the branch a human may
be working on.

The escalation is **additionally posted to Slack** (`SLACK_WEBHOOK_URL`). It has
to key on the escalation, not on the run: a conflict is the expected non-error
path, the run exits 0, and a `failure()` notification would never see a blocked
cascade. Keying on the escalation also inherits its idempotence — a cascade that
stays blocked does not re-ping the channel on every push to `main`. The Slack
step is `continue-on-error`: the issue is the source of truth, and a webhook
outage must not turn the conflict path into a run failure that §10 would then
report as a genuine forward-merge failure.

**The sync PR must be merged as a true merge commit** (`main` stays an ancestor
of `next`). Squash/rebase-merging it would reintroduce trap #1. This is enforced
by branch protection on `next` (see §5), consistent with §1.

### 5. Concurrency and branch protection

**One shared `concurrency` group per target branch**, used by _every_ workflow
that pushes to it — `mutate-main`, `mutate-next`, `mutate-major` — each with
`cancel-in-progress: false`. (`publish.yml` now uses this shared `mutate-main`
group.) As a belt-and-suspenders, each mutating job does **fetch-before-push
with one retry** (on non-fast-forward: `git fetch` + re-merge + re-push).

This removes the non-fast-forward races, but **it does not serialize** — the
original wording here was wrong. GitHub keeps at most **one pending run** per
concurrency group and **cancels it as soon as a newer run arrives**;
`cancel-in-progress: false` protects only the run that is already executing.
Measured in the #2769 rehearsal: a forward-merge run created at 15:45:32 was
cancelled at 15:47:28, one second after a `publish-next` run entered the group,
without ever starting a job. Excess runs are therefore **dropped, not delayed**,
and a cancelled run is not a `failure`, so §10 does not fire — `next` can fall
behind `main` silently.

Two mitigations, both implemented:

- **Catch-up trigger.** `forward-merge.yml` also runs on `workflow_run` when
  `publish-next.yml` completes — precisely when the group frees up. This
  terminates: the catch-up merge is idempotent (§2), normally finds no code
  delta, does not push, and so triggers no further `publish-next`.
- **Drift check.** `forward-merge-drift.yml` compares `main` against `next` on a
  schedule and escalates when the gap outlives a threshold, ignoring drift that
  an open sync issue or sync PR already accounts for — and ageing those too, so
  a forgotten escalation cannot block the cascade indefinitely without saying
  so. Its escalation goes to Slack as well, mirroring the issue and therefore
  its idempotence: the schedule runs hourly, the alert does not.

Giving `forward-merge.yml` its own group was considered and rejected:
forward-merge runs evicting each other is harmless (they always merge `main`'s
tip), but it would let `forward-merge` and `publish-next` push to `next`
concurrently, and `publish-next` pushes _after_ its npm publish — precisely the
ratchet this design exists to prevent.

**`next` is protected** (real-merge-commit-only for human PRs, direct pushes
restricted), **with the automation identity as a bypass actor** for direct
pushes. Humans go through a PR + merge commit; the bot pushes directly on the
clean path (its pushes _are_ merge commits, so the invariant holds). The bypass
must **not** waive the merge-method restriction for real PRs — only the
direct-push block.

### 6. Interaction with `publish.yml` (the re-publish)

A forward-merged fix **produces a new `next` prerelease** so that `flow@next` ⊇
`flow@latest` on npm, not merely in git. This falls out for free:

- The forward-merge stays **version-free** — it merges and pushes, nothing more.
- The push to `next` triggers **`publish.yml` on its `next` line**
  (`push: next`, symmetric to the `main` line in the same file) that runs
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
issue and pings CODEOWNERS**, and posts the same alert to Slack, so a
silently-failing sync cannot let `next` quietly fall behind `main`.

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
- **Registering it locally makes it a repo-wide merge rule, not a cascade-only
  one.** `pnpm install` runs `init-merge-drivers.cjs`, because the sync
  resolution (§4) only works with the drivers active. The price is that the
  driver then runs on every merge every developer performs, so it has to be
  correct in every direction — not just in the cascade it was designed for (see
  the 2026-08-26 amendment). Treat any future driver the same way.
- Branch protection with an automation bypass actor is a standing configuration
  that must be kept correct (bypass for direct pushes only, never for the
  merge-method restriction).

## Follow-ups (not part of this ADR)

**Landed** in #2753:

- `forward-merge.yml`, the `.gitattributes` merge drivers + the JSON merge
  driver script (`.github/scripts/merge-package-json.cjs`), and the shared
  per-target-branch `concurrency` groups; `publish.yml` moved to `mutate-main`.
- The symmetric `publish-next.yml` (`push: next` → dist-tag `next`) — merged
  into `publish.yml` on 2026-08-27, see the amendment above.

**Still pending** — gated on the 1.0.0 cut (`next` established, repo off the
`0.2.0-alpha.*` line):

- Configure `next` (and, on demand, the major line) branch protection with the
  `PUBLISH_PAT` bot as the direct-push bypass actor.
- The routing-guard `head == next`/major-line exemption (§8) — tracked with the
  guard in RFC #2711.
- Until `next` exists the cascade stays inert: `forward-merge.yml` triggers on
  `main` pushes but has no `next` to merge into, and the version-contract guard
  is dormant (see ADR 0005).
