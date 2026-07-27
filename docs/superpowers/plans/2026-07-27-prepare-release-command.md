# `/prepare-release` Command Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a `/prepare-release` Claude Code slash command (plus its
release-notes template) that opens the RFC #2711 promotion PR
(`release/x.y.0 → main`) with a curated changelog, without bumping/building/
publishing (CI does that on merge).

**Architecture:** Two versioned Markdown artifacts under `.claude/`. A format
template (`release-notes.md`) that Claude fills; a command prompt
(`prepare-release.md`) that computes the target version, drafts curated notes
into the template shape, freezes the release on a branch, and opens a Draft PR
whose body carries the notes verbatim between machine-readable markers.

**Tech Stack:** Markdown + YAML frontmatter (Claude Code command convention),
`git`, `gh` CLI, lerna-lite (versioning is CI-side), prettier (repo formatter).

## Global Constraints

- **All artifacts in English** (command text, template, PR body, commits).
- **The command performs NO** `lerna version`, build, git tag, npm publish, or
  GitHub-release creation, and makes **no local version commit** — CI owns all
  of that on merge.
- **Marker syntax is exact:** curated notes sit **verbatim** between
  `<!-- release-notes:start -->` and `<!-- release-notes:end -->`; nothing else
  goes between the markers. This block is the single source CI reads.
- **Template is minor/major only:** no Fixes section; `## Migrations` appears
  only for a major.
- **Draft PR**, and a **preview + explicit confirmation before any push**.
- **Free-text arguments**; defaults `--from next` / `--to main`; both overridable
  for prototype/testing. Compute against `origin/*` after `git fetch`.
- Prototype framing: the model is not live yet (no `next` branch, repo on
  `0.2.0-alpha.*`); the command must still be runnable via branch overrides.

---

### Task 1: Release-notes format template

**Files:**
- Create: `.claude/templates/release-notes.md`

**Interfaces:**
- Produces: a template file at the exact path `.claude/templates/release-notes.md`
  that Task 2's command references. Section order (verbatim heading text):
  `# {{headline}}`, `## Highlights`, `## Deprecations`, `## {{Feature name}}`
  (repeatable), `## Migrations`.

- [ ] **Step 1: Write the template file**

Create `.claude/templates/release-notes.md` with exactly this content:

````markdown
<!--
  Release-notes template for a minor/major promotion (next → main).
  Claude drafts the curated notes into THIS shape; the maintainer then edits.

  Authoring rules:
  - Audience: extension developers & Flow consumers. Write user-facing prose,
    not commit subjects.
  - Minor/major only — patches release separately, so there is NO Fixes section.
    Fold a user-relevant fix into the related feature's text if it matters.
  - Drop noise entirely: chore/deps/release bumps, internal refactors, CI.
  - Group by feature/area, never by commit. One "## " section per notable
    feature; link its PR(s), e.g. (#1234).
  - Screenshots/GIFs: leave the placeholder for the maintainer — do NOT
    fabricate images. Code examples are fine when grounded in the real API.
  - Delete these comments and every unused/empty section in the final text.
-->

# {{ Punchy one-line headline summarising the release }}

## Highlights

<!-- 3–6 bullets, each one user-facing sentence; the skim-readable summary. -->

- …

## Deprecations

<!-- APIs now deprecated (via useWarnDeprecation) + the replacement path.
     Appears in minors too. Delete the section if there are none. -->

- …

## {{ Feature name }}

<!-- One section per notable feature. Short paragraph: what it is and why it
     matters. Add a code example when it aids adoption. Repeat as needed. -->

{{ description }}

```tsx
// optional usage example, grounded in the real component API
```

<!-- ![caption](url) — maintainer adds a screenshot/GIF if useful -->

## Migrations

<!-- MAJOR releases only — delete this whole section for a minor.
     Per breaking change: what changed, why, and the concrete migration step.
     Link MIGRATION.md and any codemod under packages/codemods. -->
````

- [ ] **Step 2: Verify section order and headings are present**

Run:
```bash
grep -nE '^(# \{\{|## Highlights|## Deprecations|## \{\{ Feature|## Migrations)' .claude/templates/release-notes.md
```
Expected: five matching lines, in this order — the `# {{` headline, `## Highlights`, `## Deprecations`, `## {{ Feature`, `## Migrations`.

- [ ] **Step 3: Format with prettier**

Run:
```bash
pnpm exec prettier --write .claude/templates/release-notes.md
```
Expected: prettier reports the file formatted/unchanged with no error. (If
`.claude` is prettier-ignored and prettier prints an "ignored" notice, that is
also acceptable — the file is committed as written.)

- [ ] **Step 4: Commit**

```bash
git add .claude/templates/release-notes.md
git commit -m "feat(release): add curated release-notes template"
```

---

### Task 2: `/prepare-release` command prompt

**Files:**
- Create: `.claude/commands/prepare-release.md`
- Reference (read-only): `.claude/commands/review-flow.md` (frontmatter style),
  `.claude/templates/release-notes.md` (created in Task 1)

**Interfaces:**
- Consumes: the template path `.claude/templates/release-notes.md` from Task 1.
- Produces: a command whose assembled PR body contains the marker block
  `<!-- release-notes:start -->` … `<!-- release-notes:end -->`. Task 3 verifies
  extraction against exactly these marker strings.

- [ ] **Step 1: Write the command file**

Create `.claude/commands/prepare-release.md` with exactly this content:

````markdown
---
description: Prepare the release PR (next → main) — curated changelog + Draft PR (RFC #2711)
argument-hint: [optional free-text, e.g. "--from next --to main --version 0.3.0"]
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
     Conventional Commits in `origin/<to>..origin/<from>` (`feat` → minor,
     any breaking change → major).
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
   | **Source → Target** | `{{FROM}}` → `{{TO}}`                  |
   | **Version**         | `{{CURRENT_VERSION}}` → `{{VERSION}}`  |
   | **Bump**            | {{BUMP_TYPE}} ({{BUMP_BASIS}})         |

   Merging graduates the prerelease to `{{VERSION}}`, publishes all
   `@mittwald/flow-*` packages to npm under `latest`, and creates the GitHub
   release from the curated notes below.

   <!-- release-notes:start -->
   {{CURATED_NOTES}}
   <!-- release-notes:end -->

   ### Maintainer checklist

   - [ ] Release notes are curated (user-facing wording, grouped, highlights first)
   - [ ] Breaking changes surfaced + have a MIGRATION.md entry / codemod where needed
   - [ ] Target version `{{VERSION}}` is correct
   - [ ] Forward-merge state clean (no open sync PR main → next)

   <details>
   <summary>Raw commits ({{COMMIT_COUNT}}) — reference only, not published</summary>

   {{RAW_COMMIT_LIST}}

   </details>
   ```

   The curated notes MUST sit **verbatim** between `<!-- release-notes:start -->`
   and `<!-- release-notes:end -->`, with nothing else between the markers — that
   block is the single source CI reads to create the GitHub release.

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
   steps: curate the notes in the PR, tick the checklist, mark Draft → Ready, and
   merge — after which CI versions, builds, publishes under `latest`, and creates
   the GitHub release from the marker block.

## You do NOT

Run `lerna version`, build, create git tags, publish to npm, or create the
GitHub release, and you create no local version commit. All of that happens in
CI on merge.
````

- [ ] **Step 2: Verify frontmatter and required sections exist**

Run:
```bash
grep -nE '^(description|argument-hint|## Steps|## You do NOT):?|release-notes:(start|end)' .claude/commands/prepare-release.md
```
Expected: matches for both frontmatter keys (`description`, `argument-hint`),
the `## Steps` and `## You do NOT` headings, and both marker strings
(`release-notes:start`, `release-notes:end`).

- [ ] **Step 3: Verify the command references the template path**

Run:
```bash
grep -n '.claude/templates/release-notes.md' .claude/commands/prepare-release.md
```
Expected: at least one match (Step 5 of the command).

- [ ] **Step 4: Format with prettier**

Run:
```bash
pnpm exec prettier --write .claude/commands/prepare-release.md
```
Expected: prettier formats/leaves the file with no error (or reports it ignored,
as in Task 1 Step 3).

- [ ] **Step 5: Commit**

```bash
git add .claude/commands/prepare-release.md
git commit -m "feat(release): add /prepare-release command"
```

---

### Task 3: Marker-contract extraction test

Proves the single-source-of-truth mechanism: given a PR body built from the
command's frame, the exact marker strings let CI extract the curated notes
verbatim and nothing else. This de-risks the (out-of-scope) `publish.yml` change.

**Files:**
- Test fixture (scratchpad, not committed): a sample PR body + an extraction
  snippet.

**Interfaces:**
- Consumes: the marker strings `<!-- release-notes:start -->` /
  `<!-- release-notes:end -->` produced by Task 2.

- [ ] **Step 1: Write the failing extraction check (no fixture yet)**

Create the extraction script `scratchpad-extract.sh` in the session scratchpad
directory:
```bash
#!/usr/bin/env bash
set -euo pipefail
body="$1"
# Extract text strictly between the markers (markers themselves excluded).
sed -n '/<!-- release-notes:start -->/,/<!-- release-notes:end -->/p' "$body" \
  | sed '1d;$d'
```

- [ ] **Step 2: Run it against a missing fixture to confirm it fails**

Run:
```bash
bash scratchpad-extract.sh body.md
```
Expected: FAIL — `sed: can't read body.md: No such file or directory` (fixture
does not exist yet).

- [ ] **Step 3: Create a fixture PR body using the command's frame**

Create `body.md` in the scratchpad with a minimal filled frame:
```markdown
## Release 0.3.0

|                     |                          |
| ------------------- | ------------------------ |
| **Source → Target** | `next` → `main`          |
| **Version**         | `0.3.0-next.4` → `0.3.0` |
| **Bump**            | minor (graduated)        |

<!-- release-notes:start -->
# Faster forms and clearer errors

## Highlights

- New `NumberField` component (#1234).

## NumberField

A numeric input with locale-aware formatting (#1234).
<!-- release-notes:end -->

### Maintainer checklist

- [ ] Release notes are curated

<details>
<summary>Raw commits (1) — reference only, not published</summary>

- feat(NumberField): add component (#1234)

</details>
```

- [ ] **Step 4: Run the extraction and verify it returns exactly the curated block**

Run:
```bash
bash scratchpad-extract.sh body.md
```
Expected output (exactly the text between the markers, markers excluded, no meta
table, no checklist, no raw commits):
```
# Faster forms and clearer errors

## Highlights

- New `NumberField` component (#1234).

## NumberField

A numeric input with locale-aware formatting (#1234).
```

- [ ] **Step 5: Assert the frame is excluded**

Run:
```bash
bash scratchpad-extract.sh body.md | grep -c -E 'Source → Target|Maintainer checklist|Raw commits'
```
Expected: `0` (none of the frame leaks into the extracted notes). Note: `grep -c`
exits non-zero on zero matches — a printed `0` is the pass condition.

This task produces no commit (verification only); the extraction logic belongs to
the future CI change, documented in the spec.

---

### Task 4 (optional, maintainer-run): live smoke test

Exercises the real command end-to-end. It has **remote side effects** (pushes a
scratch branch, opens a PR), so run it only deliberately and clean up after.
Tasks 1–3 already verify the artifacts without side effects; skip this if you
only need the deliverables.

**Files:** none (throwaway branches + a PR that gets closed).

- [ ] **Step 1: Create scratch branches simulating the model**

```bash
git fetch origin
git push origin origin/main:refs/heads/scratch-main
git checkout -b scratch-next origin/main
```

- [ ] **Step 2: Put a prerelease version + a feature commit on `scratch-next`**

Edit `lerna.json` to set `"version": "0.3.0-next.1"`, then:
```bash
git commit -am "chore(release): set scratch prerelease 0.3.0-next.1"
git commit --allow-empty -m "feat(NumberField): add numeric input component (#9999)"
git push origin scratch-next
```

- [ ] **Step 3: Run the command against the scratch branches, stop at preview**

Invoke: `/prepare-release --from scratch-next --to scratch-main`
Expected: it computes target version `0.3.0` (stripping `-next.1`), drafts notes
that include the `NumberField` feature and omit the `chore(release)` commit, and
shows the assembled PR body preview asking for confirmation. **Decline** the
confirmation if you only want to inspect (no push happens).

- [ ] **Step 4: (Optional) Confirm, then inspect the Draft PR**

If you confirm, verify with:
```bash
gh pr view release/0.3.0 --json isDraft,baseRefName,title,body \
  --jq '{isDraft, base: .baseRefName, title, hasMarkers: (.body | contains("release-notes:start"))}'
```
Expected: `isDraft: true`, `base: "scratch-main"`, `title: "Release 0.3.0"`,
`hasMarkers: true`.

- [ ] **Step 5: Clean up**

```bash
gh pr close release/0.3.0 --delete-branch || true
git push origin --delete scratch-next scratch-main || true
git checkout - && git branch -D scratch-next
```
Expected: PR closed, all scratch branches removed locally and on `origin`.
