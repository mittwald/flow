---
description:
  "Prepare the release PR (next → main) — curated changelog + Draft PR (RFC
  #2711)"
argument-hint: "optional free-text, e.g. --from next --to main --version 0.3.0"
---

Prepare the **promotion / release PR** for mittwald Flow, following the release
model in RFC #2711. You draft a curated, user-facing changelog, freeze the
release state on a branch, **graduate the version to the stable `x.y.0` in the
PR itself**, and open a **Draft** PR. You do **not** build, tag, publish, or
create the GitHub release — CI does all of that on merge.

Graduating in the PR (rather than leaving CI to bump on merge) is deliberate:
the PR diff then reads honestly as `x.(y-1).z → x.y.0` instead of promoting a
`x.y.0-next.N` prerelease onto the stable line, and the published version no
longer hinges on CI re-deriving it. `publish.yml` detects the already-graduated
branch and **skips** its own `lerna version` (re-running it is not idempotent —
it dies on `tag already exists` or writes an empty "Version bump only" entry).

The model may not be live yet: if there is no `next` branch, Step 1 stops and
requires `--from`/`--to` overrides before doing anything else.

## Arguments

`$ARGUMENTS` is free-text; interpret it flexibly. All parts optional:

- `--from <branch>` — source/collection branch (default `next`).
- `--to <branch>` — target/stable branch (default `main`).
- `--version <x.y.0>` — explicit target version, overriding the computed one.

## Steps

1. **Fetch.** Run `git fetch --all --tags`. Compute everything against
   `origin/<from>` and `origin/<to>`, never the local working state. If the
   resolved `<from>` (default `next`) does not exist on `origin`, stop and
   explain that the model may not be live yet and that the maintainer must pass
   `--from`/`--to` overrides.

2. **Guard — `<from>` must carry all of `<to>`'s code (forward-merge
   complete).** Before doing anything else, verify that merging `origin/<to>`
   into `origin/<from>` would change nothing:

   ```shell
   pnpm dev:init-merge-drivers          # a merge= attribute is inert without this
   git checkout -q --detach origin/<from>
   git merge --no-ff --no-commit origin/<to>
   git diff --cached --quiet origin/<from>   # empty → nothing missing
   git merge --abort 2>/dev/null || git reset -q --hard origin/<from>
   ```

   **Ask about CONTENT, never about ancestry.**
   `git log origin/<from>..origin/<to>` is **not** the test: the forward-merge
   deliberately drops a merge that carries no code delta (ADR 0004 §6/§7), so
   after every release `<to>` keeps a `chore(release):` commit that never
   reaches `<from>`. An ancestry check therefore hard-stops in the perfectly
   healthy steady state — measured in the #2769 rehearsal, where this guard
   refused with "main is ahead of next — forward-merge incomplete" while the
   cascade was working exactly as designed, making the promotion impossible to
   start.

   If the probe **does** show a delta (or conflicts), hard-stop: releasing
   `<from>` would silently drop those changes. The maintainer forward-merges
   `<to>` into `<from>` — `pnpm sync:resolve` for a conflict, a
   `forward-merge.yml` dispatch otherwise — and re-runs. This guard gates the
   whole command.

3. **Version-independent preconditions.**
   - **Hard-stop** (abort and explain) if:
     - `origin/<from>` has no commits ahead of `origin/<to>` (nothing to
       release).
   - **Warn + ask to proceed** (show the problem, wait for an explicit yes) if:
     - the working tree is dirty;
     - CI on `origin/<from>` is not green (check via `gh run list` /
       `gh pr checks`). Warn only — this repo has known flaky visual/timer
       tests, so red CI is not a hard-stop.

4. **Determine the target version.**
   - Read the version from `lerna.json` on `origin/<from>`.
   - Primary: strip the prerelease id (`-next.N` / `-alpha.N`) → `x.y.0`.
   - Fallback: if that is not unambiguous, recompute the bump from the
     Conventional Commits in `origin/<to>..origin/<from>` (`feat` → minor, any
     breaking change → major).
   - `--version` overrides both.

5. **Version-dependent preconditions** (now that `x.y.0` is known).
   - **Hard-stop** (abort and explain) if any hold:
     - a `release/*` branch or an open release PR for the same version already
       exists;
     - the computed `x.y.0` already exists as a git tag or as a published npm
       version of `@mittwald/flow-react-components`.

6. **Collect raw material.** List the Conventional Commits in
   `origin/<to>..origin/<from>`. Group by type, capture scope and PR number
   (e.g. `(#1234)`), and count the commits.

7. **Draft the curated notes.** Follow `.claude/templates/release-notes.md`
   **exactly**: copy its structure, obey its authoring rules, and delete its
   authoring comments and any empty section from your output. Minor/major only —
   no Fixes section. Include `## Migrations` **only if there is something to
   migrate** (breaking changes with concrete migration steps); otherwise omit
   the whole section.

8. **Assemble the PR body** by filling this frame (replace every `{{…}}`):

   ```markdown
   ## Release {{VERSION}}

   |                     |                                       |
   | ------------------- | ------------------------------------- |
   | **Source → Target** | `{{FROM}}` → `{{TO}}`                 |
   | **Version**         | `{{CURRENT_VERSION}}` → `{{VERSION}}` |
   | **Bump**            | {{BUMP_TYPE}} ({{BUMP_BASIS}})        |

   This PR graduates the line to the stable `{{VERSION}}` (version + changelog
   already bumped on the branch). Merging publishes all `@mittwald/flow-*`
   packages to npm under `latest`, tags `{{VERSION}}`, and creates the GitHub
   release from the curated notes below.

   <!-- release-notes:start -->

   {{CURATED_NOTES}}

   <!-- release-notes:end -->

   <details>
   <summary>Raw commits ({{COMMIT_COUNT}}) — reference only, not published</summary>

   {{RAW_COMMIT_LIST}}

   </details>
   ```

   The curated notes MUST sit **verbatim** between
   `<!-- release-notes:start -->` and `<!-- release-notes:end -->`, with nothing
   else between the markers — that block is the intended single source CI reads
   to create the GitHub release. The extraction CI performs on merge must
   tolerate (trim) leading and trailing blank lines inside the marker block —
   prettier may insert blank lines adjacent to the markers, and that whitespace
   is not content.

   > ✅ **Wired up (#2724).** On a promotion merge, `publish.yml` reads this
   > marker block from the PR body and uses it verbatim as the GitHub-release
   > body (trimming blank lines adjacent to the markers). It falls back to the
   > `CHANGELOG.md` section only when there is no PR or no marker block (the
   > one-time `1.0.0` cut, or a plain dispatch). This matters because a
   > prerelease→stable graduation produces only a useless "Version bump only"
   > changelog entry — the curated block is the real release body.

9. **Preview + confirm.** Show the full assembled PR body plus the plan (branch
   `release/x.y.0`, `from → to`, `current → target` version). Ask for explicit
   confirmation **before any push or PR creation**. If declined, stop and change
   nothing on the remote.

10. **Freeze branch + Draft PR** (only after confirmation):
    - Create `release/x.y.0` from `origin/<from>`, **merge `<to>` into it**, and
      push it to `origin`:

      ```shell
      git checkout -B release/x.y.0 origin/<from>
      git merge --no-ff -m "chore(sync): merge <to> into release/x.y.0" origin/<to>

      # The changelogs must come from <to>, not <from> — see below.
      git checkout origin/<to> -- '*CHANGELOG.md'
      git commit --amend --no-edit

      # Graduate the prerelease to the stable x.y.0 IN the PR (RFC #2711): bump
      # every package + lerna.json, prepend the x.y.0 changelog entry, and create
      # the `chore(release): bump version to x.y.0` commit. --no-push keeps it
      # local. Then DROP the tag lerna creates — the release tag belongs on <to>'s
      # merge commit, and publish.yml creates + pushes it there on merge (a plain
      # `git push <branch>` would not carry a local tag anyway, but deleting it
      # avoids a stale tag pinned to the branch commit and keeps re-runs idempotent).
      pnpm lerna version x.y.0 \
        --force-publish --conventional-commits \
        --message "chore(release): bump version to %v" \
        --yes --no-push --tag-version-prefix ""
      git tag -d x.y.0

      git push origin release/x.y.0
      ```

      The merge is what makes the PR mergeable at all. **GitHub does not run the
      `.gitattributes` merge drivers** — a driver only exists in local git
      config — so a merge computed on GitHub's side surfaces every `version` and
      `CHANGELOG.md` divergence between the lines as a conflict. Measured in the
      #2769 rehearsal: the first promotion PR came out `CONFLICTING` across 35
      files, 34 of them mechanical. Here the drivers are registered (Step 2), so
      the churn is absorbed.

      It cannot change any content: Step 2 already established that merging
      `<to>` into `<from>` produces no code delta, so this merge only moves
      ancestry — which is precisely what the promotion is supposed to establish.
      If it nonetheless conflicts, stop and report the files; something changed
      between Step 2 and here.

      **The changelogs are the one exception, and the direction is the point.**
      `**/CHANGELOG.md merge=ours` (ADR 0004 §3) is written for `main → next`,
      where keeping `<from>`'s file is right. In this direction it is wrong:
      `<from>`'s changelog carries the prerelease line, interleaved with the
      stable entries it forward-merged, and promoting it **overwrites the stable
      history on `<to>`**. Measured in the #2769 rehearsal, `main` came out of a
      promotion carrying entries like `## [2.2.5](compare/2.3.0-next.4...2.2.5)`
      — a stable release comparing against a prerelease of the other line — with
      its own release bodies hollowed out. That file is what `publish.yml`
      extracts GitHub Release bodies from, so the damage reaches users. Taking
      `<to>`'s changelogs keeps the stable history intact; the graduation step
      below then prepends the `x.y.0` entry, and the prerelease entries
      disappear from the record, which is correct — they were never published
      under `latest`. (The graduated entry itself is a terse "Version bump only"
      comparing `x.y.0-next.N...x.y.0` — that is expected, and exactly why the
      GitHub release body comes from the curated marker block, not this file.)

    - Open a **Draft** PR into `<to>`. The title must be a **Conventional
      Commit** — `commit-guard.yml` lints every PR title and rejected a plain
      `Release x.y.0` in the #2769 rehearsal. It must also **not** begin with
      `chore(release):`, which is the skip-guard `publish.yml` uses to avoid
      re-publishing its own release commit:

      ```bash
      gh pr create --draft --base <to> --head release/x.y.0 \
        --title "chore(promotion): promote <from> to x.y.0" \
        --body-file <path-to-body>
      ```

      > ⚠️ **Merge as a merge commit, not squash/rebase.** The graduation commit
      > on the branch _is_ `chore(release): bump version to x.y.0`. A `--no-ff`
      > merge makes `<to>`'s new tip the merge commit (a non-`chore(release):`
      > message) so `publish.yml` runs. A **rebase** merge would leave the
      > `chore(release):` commit as `<to>`'s head and the skip-guard would abort
      > the publish; a **squash** merge collapses the graduation and its tree
      > together but is untested here — stick to the merge commit the model
      > assumes.

11. **Summary.** Print the PR URL, the target version, and the maintainer's next
    steps: curate the notes in the PR, mark Draft → Ready, and merge as a merge
    commit — after which CI builds, publishes under `latest`, tags `x.y.0`, and
    creates the GitHub release from the marker block. (CI does **not**
    re-version — the branch is already graduated.)

## You do NOT

Build, create/push git tags, publish to npm, or create the GitHub release — all
of that happens in CI on merge. You **do** graduate the version: a single local
`chore(release): bump version to x.y.0` commit on the release branch (Step 10),
with its lerna-created tag dropped. You create no other commits and push no
tags.
