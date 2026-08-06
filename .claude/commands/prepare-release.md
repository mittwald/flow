---
description:
  "Prepare the release PR (next → main) — curated changelog + Draft PR (RFC
  #2711)"
argument-hint: "optional free-text, e.g. --from next --to main --version 0.3.0"
---

Prepare the **promotion / release PR** for mittwald Flow, following the release
model in RFC #2711. You draft a curated, user-facing changelog, freeze the
release state on a branch, and open a **Draft** PR. You do **not** bump the
version, build, tag, publish, or create the GitHub release — CI does all of that
on merge.

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

2. **Guard — `<from>` must carry all of `<to>`'s code (forward-merge complete).**
   Before doing anything else, verify that merging `origin/<to>` into
   `origin/<from>` would change nothing:

   ```shell
   pnpm dev:init-merge-drivers          # a merge= attribute is inert without this
   git checkout -q --detach origin/<from>
   git merge --no-ff --no-commit origin/<to>
   git diff --cached --quiet origin/<from>   # empty → nothing missing
   git merge --abort 2>/dev/null || git reset -q --hard origin/<from>
   ```

   **Ask about CONTENT, never about ancestry.** `git log origin/<from>..origin/<to>`
   is **not** the test: the forward-merge deliberately drops a merge that carries
   no code delta (ADR 0004 §6/§7), so after every release `<to>` keeps a
   `chore(release):` commit that never reaches `<from>`. An ancestry check
   therefore hard-stops in the perfectly healthy steady state — measured in the
   #2769 rehearsal, where this guard refused with "main is ahead of next —
   forward-merge incomplete" while the cascade was working exactly as designed,
   making the promotion impossible to start.

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

   Merging graduates the prerelease to `{{VERSION}}`, publishes all
   `@mittwald/flow-*` packages to npm under `latest`, and creates the GitHub
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

   > ⚠️ **Not wired up yet.** No workflow reads this marker block today —
   > `publish.yml` still builds the GitHub-release body from `CHANGELOG.md`. The
   > marker extraction lands with the `publish.yml` follow-up (#2724, RFC
   > #2711); until then the curated notes are for the PR only and are **not**
   > published to the GitHub release.

9. **Preview + confirm.** Show the full assembled PR body plus the plan (branch
   `release/x.y.0`, `from → to`, `current → target` version). Ask for explicit
   confirmation **before any push or PR creation**. If declined, stop and change
   nothing on the remote.

10. **Freeze branch + Draft PR** (only after confirmation):
    - Create `release/x.y.0` from `origin/<from>` and push it to `origin`.
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

11. **Summary.** Print the PR URL, the target version, and the maintainer's next
    steps: curate the notes in the PR, mark Draft → Ready, and merge — after
    which CI versions, builds, publishes under `latest`, and creates the GitHub
    release from the marker block.

## You do NOT

Run `lerna version`, build, create git tags, publish to npm, or create the
GitHub release, and you create no local version commit. All of that happens in
CI on merge.
