# `run-visual-tests` PR Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `run-visual-tests` PR label that runs the full visual regression suite against existing baselines (verify-only, non-destructive) and uploads diff artifacts on failure.

**Architecture:** A new label-triggered GitHub Actions workflow modeled on `update-screenshots.yml` (label guard, label auto-removal, concurrency) but running the read-only visual command from `test-visual-scheduled.yml` (`nx run-many -t test:visual`). No baseline pushing, no Slack, no PR comment.

**Tech Stack:** GitHub Actions, pnpm, nx, Vitest 4 browser mode (Playwright), `actions/upload-artifact`.

## Global Constraints

- Node version: **24** (matches all existing workflows).
- pnpm install: **`--frozen-lockfile`**.
- Visual command MUST be `--parallel=1 --browser.fileParallelism=false` (Firefox breaks under parallel visual runs — documented in `test-visual-scheduled.yml`).
- Workflow docs/comments/commits in **English**.
- Never hand-edit generated files (not relevant here, but repo-wide rule).
- Action pin versions matching the repo: `actions/checkout@v5`, `actions/setup-node@v6`, `pnpm/action-setup@v4`, `actions/github-script@v7`, `actions/upload-artifact@v4`.

---

### Task 1: Add the label-triggered visual-test workflow

**Files:**
- Create: `.github/workflows/test-visual-label.yml`

**Interfaces:**
- Consumes: repo scripts `test:browser:prepare`, nx target `test:visual`; GitHub label named `run-visual-tests` (provisioned in Task 3).
- Produces: a workflow named "Run Visual Regression Tests" triggered by the `run-visual-tests` label and by `workflow_dispatch`; on failure an artifact named `visual-diffs`.

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/test-visual-label.yml` with exactly this content:

```yaml
name: Run Visual Regression Tests

on:
  workflow_dispatch:
  pull_request:
    types:
      - labeled

jobs:
  run-visual-tests:
    runs-on: ubuntu-latest
    if: >
      github.event_name == 'workflow_dispatch' ||
      (github.event.label.name == 'run-visual-tests' &&
       github.head_ref != github.event.repository.default_branch)

    # one at a time per branch; re-labeling supersedes an in-flight run
    concurrency:
      group: visual-regression-run@${{ github.head_ref }}
      cancel-in-progress: true

    permissions:
      pull-requests: write # needs to remove the triggering label

    steps:
      - name: Remove label if exists
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          github-token: ${{ github.token }}
          script: |
            const label = "run-visual-tests";
            try {
                await github.rest.issues.removeLabel({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: context.issue.number,
                    name: label,
                });
                console.log(`Label '${label}' removed.`);
            } catch (e) {
                if (e.status === 404) {
                   console.log(`Label '${label}' not present, skipping.`);
                } else {
                    throw e;
                }
            }

      - name: Checkout selected branch
        uses: actions/checkout@v5
        with:
          ref: ${{ github.head_ref }}
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v6
        with:
          node-version: 24

      - run: pnpm install --frozen-lockfile

      - run: pnpm test:browser:prepare --only-shell

      - name: Run visual tests
        # run without file parallelism, because firefox has issues with parallel visual tests
        run: |
          pnpm nx run-many -t test:visual --parallel=1 --browser.fileParallelism=false

      - name: Upload visual diffs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs
          path: packages/**/.vitest-attachments/**
          if-no-files-found: ignore
          retention-days: 7

      - name: Summary
        if: always()
        run: |
          if [[ "${{ job.status }}" == "success" ]]; then
            echo "### ✅ Visual Regression Tests Passed" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "All visual snapshots match the committed baselines." >> $GITHUB_STEP_SUMMARY
          else
            echo "### ❌ Visual Regression Tests Failed" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "One or more snapshots differ from the committed baselines." >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "Download the **visual-diffs** artifact from this run to inspect the actual/diff images." >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "If the changes are intentional, update the baselines by adding the \`update-screenshots\` label to the PR." >> $GITHUB_STEP_SUMMARY
          fi
```

- [ ] **Step 2: Validate the YAML parses**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/test-visual-label.yml')); print('valid')"`
Expected: `valid`

- [ ] **Step 3: Sanity-check against the two reference workflows**

Run: `diff <(grep -E 'uses:|node-version|frozen-lockfile|run-many|fileParallelism' .github/workflows/test-visual-scheduled.yml) <(grep -E 'uses:|node-version|frozen-lockfile|run-many|fileParallelism' .github/workflows/test-visual-label.yml) || true`
Expected: the label workflow contains the same install/prepare/run-many/fileParallelism lines as the scheduled one (extra lines in the label workflow are fine). Confirm the `run-many … --parallel=1 --browser.fileParallelism=false` line is present and identical.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/test-visual-label.yml
git commit -m "ci: add run-visual-tests label to trigger visual regression suite

Adds a label-triggered (and workflow_dispatch) workflow that runs the full
visual regression suite against committed baselines without updating them,
uploading actual/diff images as the visual-diffs artifact on failure.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Document the label in AGENTS.md

**Files:**
- Modify: `AGENTS.md` (Definition of Done, item 8)

**Interfaces:**
- Consumes: the label name `run-visual-tests` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update the Definition of Done line**

In `AGENTS.md`, find item 8 under "Definition of Done — component work":

```
8. Intentional visual changes: snapshots updated (`test:visual:update` or the
   `update-screenshots` PR label)
```

Replace it with:

```
8. Visual changes: run the suite on demand with the `run-visual-tests` PR label
   (verify only); for intentional changes, update snapshots (`test:visual:update`
   or the `update-screenshots` PR label)
```

- [ ] **Step 2: Verify the edit**

Run: `grep -n "run-visual-tests" AGENTS.md`
Expected: one match on the Definition of Done line.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: document run-visual-tests PR label in AGENTS.md

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Provision the GitHub label (manual, cannot be committed)

**Files:** none (GitHub repo settings).

**Interfaces:**
- Consumes: nothing.
- Produces: a repo label `run-visual-tests` that makes the Task 1 trigger addable.

> This step requires repo admin/`gh` auth and is NOT a code change. The implementing agent should surface the command to the user rather than run it silently, since it mutates repo settings.

- [ ] **Step 1: Create the label**

Present this command to the user to run (or run only with explicit approval):

```bash
gh label create run-visual-tests \
  --description "Run the visual regression suite on this PR (verify only)" \
  --color 1D76DB
```

Expected: `✓ Label "run-visual-tests" created` (or a note that it already exists).

- [ ] **Step 2: Confirm it exists**

Run: `gh label list --search run-visual-tests`
Expected: `run-visual-tests` appears in the list.

---

## Self-Review

**Spec coverage:**
- Trigger (label + workflow_dispatch) → Task 1 `on:` block. ✅
- Guard (label name + non-default branch, tolerant of dispatch) → Task 1 `if:`. ✅
- Concurrency, permissions (pull-requests: write, no contents: write) → Task 1. ✅
- Label auto-removal → Task 1 "Remove label if exists" (gated to `pull_request`). ✅
- Full-suite `run-many` visual run with parallel/fileParallelism flags → Task 1 "Run visual tests". ✅
- Upload actual/diff PNGs on failure from `.vitest-attachments` → Task 1 "Upload visual diffs". ✅
- Step summary pass/fail pointing to artifact → Task 1 "Summary". ✅
- AGENTS.md doc update → Task 2. ✅
- Manual label provisioning → Task 3. ✅

**Placeholder scan:** none — full YAML and exact edits are inline.

**Type/name consistency:** label string `run-visual-tests` used identically in the `if` guard, the removal script, the artifact context, and Tasks 2–3. Artifact name `visual-diffs` used consistently in upload step and summary text.

**Note on testing style:** GitHub Actions workflows have no unit-test harness, so tasks verify via YAML parse + structural diff against the proven reference workflows rather than red-green TDD. The true end-to-end check (label a PR, observe run + artifact) happens post-merge on a real PR and is captured in the spec's testing section.
