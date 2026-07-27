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

The model may not be live yet: if there is no `next` branch, require `--from`/
`--to` overrides and say so before doing anything else.

## Arguments

`$ARGUMENTS` is free-text; interpret it flexibly. All parts optional:

- `--from <branch>` — source/collection branch (default `next`).
- `--to <branch>` — target/stable branch (default `main`).
- `--version <x.y.0>` — explicit target version, overriding the computed one.

## Steps

1. **Fetch.** Run `git fetch --all --tags`. Compute everything against
   `origin/<from>` and `origin/<to>`, never the local working state.

2. **Preconditions.**
   - **Hard-stop** (abort and explain) if any hold:
     - `origin/<from>` has no commits ahead of `origin/<to>` (nothing to
       release);
     - a `release/*` branch or an open release PR for the same version already
       exists;
     - the computed `x.y.0` already exists as a git tag or as a published npm
       version of `@mittwald/flow-react-components`.
   - **Warn + ask to proceed** (show the problem, wait for an explicit yes) if:
     - the working tree is dirty;
     - the forward-merge is behind (`origin/<to>` has commits not on
       `origin/<from>`);
     - CI on `origin/<from>` is not green (check via `gh run list` /
       `gh pr checks`). Warn only — this repo has known flaky visual/timer
       tests, so red CI is not a hard-stop.

3. **Determine the target version.**
   - Read the version from `lerna.json` on `origin/<from>`.
   - Primary: strip the prerelease id (`-next.N` / `-alpha.N`) → `x.y.0`.
   - Fallback: if that is not unambiguous, recompute the bump from the
     Conventional Commits in `origin/<to>..origin/<from>` (`feat` → minor, any
     breaking change → major).
   - `--version` overrides both.

4. **Collect raw material.** List the Conventional Commits in
   `origin/<to>..origin/<from>`. Group by type, capture scope and PR number
   (e.g. `(#1234)`), and count the commits.

5. **Draft the curated notes.** Follow `.claude/templates/release-notes.md`
   **exactly**: copy its structure, obey its authoring rules, and delete its
   authoring comments and any empty section from your output. Minor/major only —
   no Fixes section. Include `## Migrations` only for a major.

6. **Assemble the PR body** by filling this frame (replace every `{{…}}`):

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

   ### Maintainer checklist

   - [ ] Release notes are curated (user-facing wording, grouped, highlights
         first)
   - [ ] Breaking changes surfaced + have a MIGRATION.md entry / codemod where
         needed
   - [ ] Target version `{{VERSION}}` is correct
   - [ ] Forward-merge state clean (no open sync PR main → next)

   <details>
   <summary>Raw commits ({{COMMIT_COUNT}}) — reference only, not published</summary>

   {{RAW_COMMIT_LIST}}

   </details>
   ```

   The curated notes MUST sit **verbatim** between
   `<!-- release-notes:start -->` and `<!-- release-notes:end -->`, with nothing
   else between the markers — that block is the single source CI reads to create
   the GitHub release.

7. **Preview + confirm.** Show the full assembled PR body plus the plan (branch
   `release/x.y.0`, `from → to`, `current → target` version). Ask for explicit
   confirmation **before any push or PR creation**. If declined, stop and change
   nothing on the remote.

8. **Freeze branch + Draft PR** (only after confirmation):
   - Create `release/x.y.0` from `origin/<from>` and push it to `origin`.
   - Open a **Draft** PR into `<to>`:
     ```bash
     gh pr create --draft --base <to> --head release/x.y.0 \
       --title "Release x.y.0" --body-file <path-to-body>
     ```

9. **Summary.** Print the PR URL, the target version, and the maintainer's next
   steps: curate the notes in the PR, tick the checklist, mark Draft → Ready,
   and merge — after which CI versions, builds, publishes under `latest`, and
   creates the GitHub release from the marker block.

## You do NOT

Run `lerna version`, build, create git tags, publish to npm, or create the
GitHub release, and you create no local version commit. All of that happens in
CI on merge.
