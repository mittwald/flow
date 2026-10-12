---
description:
  "Prepare the release PR (next → main) — curated changelog + Draft PR (RFC
  #2711)"
argument-hint: "optional free-text, e.g. --from next --to main --version 0.3.0"
---

Prepare the **promotion / release PR** for mittwald Flow, following the release
model in RFC #2711. You draft a curated, user-facing changelog, **capture its
figures from the real Styleguide examples**, freeze the release state on a
branch, **graduate the version to the stable `x.y.0` in the PR itself**, and
open a **Draft** PR. You do **not** build, tag, publish, or create the GitHub
release — CI does all of that on merge.

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

   For each feature section, note whether it maps to a component with an example
   on its Styleguide page (`apps/docs/src/content/**/examples/`). Those get a
   figure in the next step; a feature with nothing to show — the
   `@mittwald/flow-codemods` CLI, a build change — gets none, and you say so
   rather than leaving an empty placeholder behind. A component feature whose
   page lacks an example gets none either: say so, and name the missing example
   in the summary so it lands on the page — never capture a Storybook story
   instead.

8. **Capture the figures.** One per notable feature that has an example, never
   one per prop variant: compose the variants into a single image.

   Figures come from the Styleguide examples, never from Storybook: they are
   served from the docs site, where the stories' Star Wars fixtures are out of
   place. The docs dev server renders each example on its own under
   `/example-preview/<path>` — `next dev` only, the static export does not ship
   it.

   The dev server renders the **working tree**, so freeze the release content
   first. This is local; nothing reaches the remote before the gate in Step 10:

   ```shell
   git checkout -B release/x.y.0 origin/<from>
   ```

   An example is addressed by its page's content path plus its name:
   `apps/docs/src/content/components/form-controls/rating/examples/max-value.tsx`
   is `components/form-controls/rating/max-value`. Write a spec per figure —
   strict JSON, no comments and no trailing commas — and capture it:

   ```json
   {
     "name": "rating",
     "panels": [
       {
         "example": "components/form-controls/rating/max-value",
         "caption": "maxValue={10}",
         "expect": [{ "selector": "input[type=radio]", "count": 10 }]
       },
       {
         "example": "components/form-controls/rating/segments",
         "caption": "fill=\"single\" with <RatingSegment> children"
       }
     ],
     "scale": 2,
     "version": "1.1.0",
     "width": 500
   }
   ```

   `version` + `name` give the output path
   (`apps/docs/public/assets/releases/1.1.0/rating.png`); `width` is the CSS px
   the examples render at and `scale` the `deviceScaleFactor`; `caption` is the
   monospace line above a panel, naming the prop it demonstrates; `expect`
   asserts what the panel rendered — the whole frame is searched, so an overlay
   in a portal counts.

   ```shell
   pnpm release:figure --spec <spec.json>
   ```

   The script starts its own docs dev server on a free port via
   `pnpm nx dev docs` and stops it again. For several figures, start one and
   reuse it — port 3000 is routinely held by another worktree's docs server:

   ```shell
   pnpm nx dev docs -- --port 3417
   pnpm release:figure --spec <spec.json> --docs-url http://localhost:3417
   ```

   A typo in an example path fails before any server starts and lists the page's
   examples. An example that throws aborts the capture.

   The renderer is whichever Playwright browser is installed — Chromium first,
   then WebKit, then Firefox, and the run names the one it used. Pin it with
   `--browser <name>`. `pnpm test:browser:prepare` installs only WebKit and
   Firefox, so add `pnpm exec playwright install chromium` if you want Chromium.
   There is no `--out`: the spec is the only source of the output path, which
   keeps every figure inside the release-assets tree.

   **Use `expect` for what the figure is about.** A panel waits until its
   expectations hold, so content that appears after mount — a chart's bars, an
   open overlay — is captured drawn, not half-way.

   **Then open every PNG and look at it.** A capture that is clipped, cropped
   wrong or showing the wrong state renders fine and reads as plausible; the
   first #3029 capture lost the bottom of its icons and survived a first pass.
   Re-capture rather than ship a bad crop. An example whose overlay extends past
   its frame is clipped — the docs examples keep overlays inside
   (`paddingBlockEnd`), which is what the CoachMark example does.

   **Commit the figures on the release branch and reference them by the commit's
   SHA.** Not a `user-attachments` upload: GitHub has no API for those — they
   need an interactive logged-in browser session, which is exactly where #3029
   stopped. A SHA URL needs no session, resolves the moment the commit exists
   (so it works during PR review), and keeps resolving after `release/x.y.0` is
   deleted post-merge. A branch URL does not, and a tag URL does not exist yet
   at review time.

   ```shell
   git add apps/docs/public/assets/releases/x.y.0
   git commit -m "docs(releases): add the x.y.0 release-note figures"
   git rev-parse HEAD   # ← FIGURE_SHA, substituted into the notes in Step 9
   ```

   The merge carries the asset onto `<to>`, and under
   `apps/docs/public/assets/releases/<version>/` the docs site serves it too —
   which matters because `/releases` mirrors the GitHub Releases, so one asset
   covers both surfaces. Committed binaries are no new precedent: `main` already
   carries ~950 PNG/GIF files.

   Two constraints the `/releases` rendering imposes, both verified:
   - **Markdown image syntax, never an HTML `<img>`.** GitHub renders raw HTML
     in a release body; the docs site's `<Markdown>` does not enable
     `rehype-raw` and drops it. An HTML tag therefore works on one surface and
     silently vanishes on the other — and with it any `width` attribute.
   - **Nothing can resize the figure afterwards**, since that `width` attribute
     is unavailable. Both surfaces cap it with `max-width: 100%`, so an
     oversized figure is scaled down and an undersized one is simply small.
     `width × scale` is the pixel width, and the script prints it.

9. **Assemble the PR body** by filling this frame (replace every `{{…}}`):

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

   Every figure from Step 8 goes into `{{CURATED_NOTES}}` as a markdown image at
   the SHA that step recorded:

   ```markdown
   ![Rating figure](https://raw.githubusercontent.com/mittwald/flow/{{FIGURE_SHA}}/apps/docs/public/assets/releases/{{VERSION}}/rating.png)
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

10. **Preview + confirm.** Show the full assembled PR body plus the plan (branch
    `release/x.y.0`, `from → to`, `current → target` version) and the figures
    captured in Step 8. Ask for explicit confirmation **before any push or PR
    creation** — pushing is what makes the figure URLs publicly resolvable. If
    declined, stop and change nothing on the remote.

11. **Push the branch + open the Draft PR** (only after confirmation):
    - `release/x.y.0` already exists locally from Step 8 and carries the figure
      commit. **Do not re-create it** — a second
      `git checkout -B … origin/<from>` resets the branch and drops the figures,
      and the notes then point at a SHA that never reaches the remote. **Merge
      `<to>` into it** and push:

      ```shell
      git merge --no-ff -m "chore(sync): merge <to> into release/x.y.0" origin/<to>

      # The changelogs must come from <to>, not <from> — see below. Commit that
      # on its own. Do NOT `git commit --amend`: the merge above usually creates
      # no commit, so HEAD is Step 8's figure commit — amending it would change
      # its SHA and break every image URL in the notes.
      git checkout origin/<to> -- '*CHANGELOG.md'
      git diff --cached --quiet ||
        git commit -m "chore(sync): take the stable changelogs from <to>"

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

      **Expect the merge to do nothing, and do not build on it.** In the healthy
      steady state `<to>` is already an ancestor of `<from>`, so git prints
      "Already up to date." and writes no commit — measured on the 1.2.0
      promotion (#3210), where `origin/next..origin/main` was empty. Any step
      that assumes a fresh merge commit exists is wrong by default.

      The merge stays in the recipe for the case where it _is_ needed: `<to>`
      may carry a commit `<from>` never received, and then this merge is what
      makes the PR mergeable at all. **GitHub does not run the `.gitattributes`
      merge drivers** — a driver only exists in local git config — so a merge
      computed on GitHub's side surfaces every `version` and `CHANGELOG.md`
      divergence between the lines as a conflict. Measured in the #2769
      rehearsal: the first promotion PR came out `CONFLICTING` across 35 files,
      34 of them mechanical. Here the drivers are registered (Step 2), so the
      churn is absorbed.

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

      > **How the PR may be merged.** Two mechanisms decide this, and neither is
      > the merge's shape as such: `publish.yml` resolves the graduation from
      > the merged PR's **head ref** (`commits/{sha}/pulls` → `release/x.y.0` →
      > `1.1.0`) — a branch of this repository only, never a fork's — and its
      > skip-guard tests the **subject line of `<to>`'s new tip** against
      > `chore(release):` — which the graduation commit on the branch _is_.
      >
      > 1. **Merge commit — do this.** `<to>`'s tip becomes the merge commit, so
      >    the guard passes and the history stays intact in one step.
      > 2. **Squash — works, loses the history.** Verified on 1.1.0 (#3029): the
      >    tip is titled from the PR title, which `commit-guard.yml` already
      >    forces to be a Conventional Commit and which this command already
      >    forbids from starting with `chore(release):`. All 148 commits
      >    collapsed into one, so the individual history is reachable only
      >    through `<from>`. Acceptable only if someone deliberately wants that.
      > 3. **Rebase — never.** It leaves the branch's own
      >    `chore(release): bump version to x.y.0` as `<to>`'s tip, the
      >    skip-guard aborts, and nothing is published.

12. **Summary.** Print the PR URL, the target version, the figures captured (or
    why a feature has none), and the maintainer's next steps: curate the notes
    in the PR, mark Draft → Ready, and merge as a merge commit — after which CI
    builds, publishes under `latest`, tags `x.y.0`, and creates the GitHub
    release from the marker block. (CI does **not** re-version — the branch is
    already graduated.)

## You do NOT

Build, create/push git tags, publish to npm, or create the GitHub release — all
of that happens in CI on merge. You also do **not** fabricate an image: a figure
is a capture of a real Styleguide example or it does not exist.

You **do** graduate the version: the local
`chore(release): bump version to x.y.0` commit on the release branch (Step 11),
with its lerna-created tag dropped — preceded by Step 8's figure commit, the
changelog restore, and, where `<to>` is not already an ancestor, the sync merge.
You create no commits beyond those and push no tags.
