# Opening a major line — runbook

Follow this document to open, run and retire an on-demand major line (`2.x`).
[ADR 0004 §11](adr/0004-forward-merge-main-into-next.md#11-the-major-line) says
the `next → major` cascade uses "the same mechanism" as `main → next`. That is
true of the **design**. It is not true of the **configuration**: every piece of
automation is hardcoded to the two standing lines, so opening the line means
editing the commit guards, the publish workflow and the sync tooling, standing
up a second cascade, and creating a ruleset. Everything below is a prerequisite
for the line's first pull request, not a follow-up.

For the model itself see [`release-workflow.md`](release-workflow.md); for the
cascade mechanics [ADR 0004](adr/0004-forward-merge-main-into-next.md).

## Before you start

A major line is rare **by policy**: breaking changes are avoided, not scheduled
— deprecate the old path and warn via `useWarnDeprecation` instead
([ADR 0005](adr/0005-semver-contract.md)). Open the line only when a change
genuinely cannot be made additive.

## The decisions, recorded

These four have to be fixed before anything is configured, because the workflow
edits below encode them.

| Decision              | Value                                      | Why                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch name           | `2.x`                                      | The routing guard's head-ref exemption already matches `^([0-9]+\.(x\|[0-9]+)\|next-major)$`, so a promotion PR out of the line is exempt without another code change.                                                                                                                                                                                                                                            |
| npm dist-tag          | `next-major`                               | `next` is taken by the collection line, and `latest` is the stable line. `next-major` is the npm convention for exactly this channel.                                                                                                                                                                                                                                                                             |
| Prerelease id (preid) | `major` → `2.0.0-major.N`                  | Kept separate from the dist-tag so the published version string stays readable. Neither value has a usable default — both must be passed explicitly (see `publish.yml` below).                                                                                                                                                                                                                                    |
| Publish workflow      | `publish.yml`, extended — never a new file | npm's Trusted Publisher binds one workflow **filename** per package and allows exactly one publisher per package. A second file authenticates as an unknown identity and fails with `E404` for every package — that is what killed the first two `next` publishes and forced the consolidation in #2968. Splitting the job into a reusable workflow does not help: npm validates the **calling** workflow's name. |

## 1. Create the branch, then the ruleset — in that order

```bash
git fetch origin && git push origin origin/next:refs/heads/2.x
```

Branch off `next`, not `main`: the major line must be a superset of the
collection line from the start, or its first cascade run is a large conflict.

The ruleset has to come **second**: like `main`'s and `next`'s, it carries a
`creation` rule, which blocks creating the branch it protects.

**The ruleset is not optional, and it is not a nicety.** Without one the branch
inherits only the repo-wide merge settings — and those allow **both** merge
commits and squash merges (`allow_merge_commit: true`,
`allow_squash_merge: true`). A squashed sync PR is how #2963/#2969 broke the
superset invariant on `next`: the merge commit `e25acaaa5` landed with a single
parent, so the content arrived but the ancestry did not, the cascade re-hit the
same conflicts on every subsequent run, and the stale escalation issue
suppressed the alert while it did.

Copy `next`'s ruleset and change the ref and nothing else:

```bash
gh api repos/mittwald/flow/rulesets --jq \
  '.[] | select(.name == "next") | .id'
# -> 21556409
gh api "repos/mittwald/flow/rulesets/21556409" > /tmp/next-ruleset.json
```

The shape it must end up with:

- `conditions.ref_name.include`: `["refs/heads/2.x"]`
- `rules`: `deletion`, `non_fast_forward`, `creation`, plus
  - `pull_request` with **`allowed_merge_methods: ["merge"]`** — merge commits
    only, so the sync PR cannot be squashed (ADR 0004 §1/§4);
  - `required_status_checks` with the contexts `main`, `Conventional PR title`,
    `Routing (feature -> next, breaking -> major line)` and
    `Version contract (engines.node + peer ranges)`.
    `strict_required_status_checks_policy` stays `false`, matching both existing
    rulesets.
- `bypass_actors`: repository role `5` (admin) and user `62147274`
  (`mittwald-machine`, the `PUBLISH_PAT` identity), both `bypass_mode: always`.
  The bypass exists so the cascade can push its merge commits directly; it must
  never be read as permission to squash a real PR.

Do **not** require the `coverage` context. `coverage.yml` triggers on
`pull_request: branches: [main]` only, so on a major-line PR the check never
reports — and a required context that never reports blocks every PR on the line.
`next`'s ruleset omits it for the same reason.

## 2. `commit-guard.yml` — the base-ref gate

Both jobs are gated on the base branch:

```yaml
if: >-
  github.event.pull_request.base.ref == 'main' ||
  github.event.pull_request.base.ref == 'next'
```

`routing` (L57-59) and `version-contract` (L119-121). A PR targeting `2.x` gets
**no** conventional-title check, no routing check and no version-contract check.
The version-contract hole is the expensive one: a peer-range tightening or an
`engines.node` bump then lands without the breaking marker, and the changelog
preset needs that marker to render the `⚠ BREAKING CHANGES` section at all —
without it the entry does not move, it disappears (#2883).

**Do not extend the two `if:` expressions.** Move the base-ref test into the
step instead, where a regex is available, and let both jobs always run and
always report. Reasons, in order of weight:

1. The ruleset above requires those contexts. A job that never runs cannot be
   relied on to report them.
2. Actions `if:` has no regex, so a literal list has to be edited again for
   every future line — which is the failure this runbook exists to prevent.
3. `version-contract` already has a `gate` step (`steps.gate.outputs.active`)
   guarding its checkout; the base-ref test belongs there, next to the
   promotion/sync exemption it already performs.

The line test is the one the head-ref exemption already uses:

```bash
case "$BASE_REF" in
  main|next) ;;
  *) printf '%s' "$BASE_REF" | grep -qE '^([0-9]+\.(x|[0-9]+)|next-major)$' \
       || { echo "::notice::'${BASE_REF}' is not a release line — nothing to enforce."; exit 0; } ;;
esac
```

Routing itself needs no new rule: a breaking change is rejected on `main` and
`next` and allowed everywhere else, which is exactly right for `2.x`.

## 3. `publish.yml` — six places, not one

`LINE` is binary (L200) and the concurrency group follows the same shape (L61):

```yaml
LINE: ${{ github.ref == 'refs/heads/next' && 'next' || 'main' }}
concurrency: mutate-${{ github.ref == 'refs/heads/next' && 'next' || 'main' }}
```

Add `2.x` to `on.push.branches` without touching those two expressions and the
major line classifies as the **stable** line: it would publish `X.Y.Z` under
dist-tag `latest` and push a release commit to `main`. Today the branch is inert
only because the push trigger does not list it.

All six edits, and none of them is optional:

1. **`on.push.branches`** (L33-36) — add `2.x`.
2. **`concurrency.group`** (L60-61) — resolve the major line to `mutate-major`,
   the group ADR 0004 §5 names and the one the cascade below must share.
3. **`LINE`** (L200) — three-way. Everything that is not `next` and not the
   major line stays the stable line; the one-time-cut dispatch on its own branch
   depends on that fallback (#2769 finding 15).
4. **The prerelease version step.** `Version (next line)` is gated on
   `env.LINE == 'next'`. Its seed formula computes `${M}.${m+1}.0-next.0` from
   `origin/main`'s version — a **minor** prerelease, because that is what `next`
   collects. The major line needs `${M+1}.0.0-major.0`, and `--preid major`
   instead of `--preid next` on the count-up path. Both the seed and the preid
   are line-specific; the surrounding logic ("at or below what `main` released →
   open a fresh line, otherwise count up") is not, and carries over unchanged.
5. **The `Publish` step's dist-tag** — `--dist-tag next-major` for the major
   line. It is the only difference between the lines at publish time.
6. **`Push release commit & tag (next line)`** — gated on `LINE == 'next'` and
   pushing `HEAD:next` literally. It needs the major line's ref. Keep the
   deliberate absence of a GitHub Release: per RFC #2711 the curated Release is
   canonical only at promotion, and one Release per prerelease is noise.

Two things that are already right and must stay that way: the `decide` job is
line-agnostic (a docs-only push to `2.x` publishes nothing, #2931), and
`AUTO_PUBLISH_ENABLED` is the kill switch for the **stable** line only — put the
major line on the same side of that condition as `next`, or flipping the switch
silently stops the major line from tracking `next`.

## 4. The second cascade — and the cross-talk it causes

`forward-merge.yml` is `main → next` throughout: `ref: next`,
`compare/next...main`, concurrency group `mutate-next`, sync branch
`sync/main-to-next`, and a fixed escalation title. The `next → major` cascade
needs its own instance (a second file is fine here — the Trusted-Publisher
filename constraint applies to publishing, nothing else) or a parameterised one
called twice.

Whichever shape you pick, **the two instances must not be able to see each
other's escalations.** Three places currently search by a phrase or a label that
is not line-specific:

- `close_sync_issue()` closes **every** open `sync`-labelled issue matching
  `in:title "Forward-merge blocked"`. The `main → next` title is
  `Forward-merge blocked: main into next needs a manual resolution`, so a
  healthy `main → next` run would close the major line's escalation while that
  conflict is still unresolved.
- `open_sync_issue()` suppresses a second issue by the same phrase search, so
  the major line's escalation would never be opened while the `main → next` one
  is.
- `forward-merge-drift.yml` looks up its blocker with
  `gh issue list --label sync` and **no** title filter, taking `.[0]`.

Give each cascade its own escalation title and search on the full title, not on
the shared prefix. The sync branch name (`sync/next-to-major`) and the
`workflow_run` catch-up guard are line-specific too: the guard exists because a
run evicted from the target branch's concurrency group is retried by nothing, so
it must fire when **the major line's** publish frees `mutate-major` — not when
`next` publishes.

`forward-merge-drift.yml` needs the same treatment: it watches `main` against
`next` only, and the major line needs its own instance. Its content-not-ancestry
probe carries over unchanged, and so must its reason — ADR 0004 §6/§7 drops a
churn-only merge, so an ancestry test reports drift forever.

`.gitattributes` already covers the cascade generically: the `CHANGELOG.md` and
`package.json` merge drivers are declared for all paths, and the package-json
driver resolves `version` to the **higher** semver of the two sides, which is
the major line on a `next → major` merge. Nothing to change there.

## 5. `sync:resolve` — hardcoded, and load-bearing

`pnpm sync:resolve` (`.github/scripts/sync-resolve.cjs`) is the **only** path
back from a conflict, because GitHub does not run the `.gitattributes` merge
drivers — they exist in local git config only. Resolving on the PR instead
buries the one genuine conflict under dozens of mechanical ones (35 conflicting
files in the #2769 rehearsal, 34 of them noise).

It is hardcoded to `main → next`: `BRANCH = "sync/main-to-next"`, the fetch and
merge of `origin/main` into `origin/next`, the merge message, and the PR's base.
Give it `--from` / `--to` (defaulting to `main` / `next`, like
`/prepare-release` already does) before the major line's first conflict, not
after. Its `--continue` guard — refuse to commit while conflict markers are
left, keep the merge a true merge commit — is line-agnostic and stays.

## 6. Verify before the first real PR

Open a throwaway PR against `2.x` and confirm, in this order:

1. All four required contexts **report** — `main`, `Conventional PR title`,
   `Routing …`, `Version contract …`. A pending context that never arrives is
   the failure mode step 2 is written to avoid.
2. The routing guard **rejects** a `feat!:` title on `main` and **accepts** it
   on `2.x`.
3. Only the merge button is offered, not squash.
4. Land a `fix:` on `main` and watch both cascades carry it to `next` and then
   to `2.x`, then check that the major-line publish produced `2.0.0-major.N`
   under dist-tag `next-major` —
   `npm view @mittwald/flow-react-components dist-tags`.
5. Force a conflict on purpose and confirm the escalation names the major line,
   that the `main → next` cascade does not close it, and that
   `pnpm sync:resolve --from next --to 2.x` resolves it.

## 7. Promotion and retirement

The promotion is `/prepare-release --from 2.x --to main`. The command is already
parameterised, and the pieces it depends on carry over:

- Its version derivation strips the prerelease id, so `2.0.0-major.N` → `2.0.0`.
- Its forward-merge guard asks about **content**, not ancestry — the same reason
  the drift check does.
- It restores **`main`'s** changelogs after its merge.
  `**/CHANGELOG.md merge=ours` is written for the cascade direction; in a
  promotion it would overwrite the stable release history that `publish.yml`
  builds GitHub Release bodies from (ADR 0004 §3).
- `publish.yml` detects the pre-graduated version and skips its own
  `lerna version`; the graduation keys on a `release/*` head ref, which is what
  the command creates regardless of the source line.
- Routing and the version contract exempt `release/*` heads, so the promotion PR
  is not blocked by the breaking changes it exists to ship.

Then retire the line, in this order:

1. Let the normal `main → next` cascade carry `2.0.0` into `next`. `next` is now
   at or below `main`, so `publish.yml`'s re-seed rule opens a fresh
   `2.1.0-next.0` on its own — that path is already implemented and needs no
   help.
2. Remove `2.x` from `publish.yml` (trigger, concurrency, `LINE`, the two
   line-specific steps), and remove or disable the `next → major` cascade and
   its drift instance.
3. Delete the ruleset, then the branch. A major line is not kept warm: the next
   one starts from this document again.

**A major line is seeded once and never re-seeded.** The seed in step 3.4
derives from `main`'s version, so a line kept alive across its own promotion
would keep producing prereleases of an already-released version — which semver
sorts _below_ it. Retiring is what makes that unreachable.

## Where to look next

- [`release-workflow.md`](release-workflow.md) — the model, the branches, what
  each one publishes.
- [ADR 0004](adr/0004-forward-merge-main-into-next.md) — cascade mechanics:
  merge strategy, drivers, sync PRs, concurrency.
- [ADR 0005](adr/0005-semver-contract.md) — what a breaking change is, and why
  the line is rare.
- [`.claude/commands/prepare-release.md`](../.claude/commands/prepare-release.md)
  — the promotion command in full.
