# Design: `run-visual-tests` PR label

**Date:** 2026-07-15
**Status:** Approved (pending spec review)

## Problem

Visual regression tests run in two places today:

- **`test.yml`** (every PR) runs `affected:test:browser`, which includes
  `test:visual` — but only for packages nx considers *affected*. `test:visual`
  currently exists only in `remote-react-components`, so a PR that nx does not
  link to that package never runs visual tests.
- **`test-visual-scheduled.yml`** runs the full visual suite (`run-many`) twice
  daily and on manual `workflow_dispatch`, alerting Slack on failure.

There is a label to **update** baselines (`update-screenshots.yml`, triggered by
the `update-screenshots` label), but no way to **run/verify** the visual suite
on demand for a specific PR. When nx `affected` skips visual tests, a developer
who changed styling has no in-PR trigger to force a verification run.

## Goal

Add a PR label `run-visual-tests` that runs the full visual regression suite
against the existing baselines and fails the check on mismatch. Non-destructive:
it never updates or pushes baselines. On failure it uploads the actual/diff
images as workflow artifacts so the developer can inspect what changed.

## Non-goals (YAGNI)

- No PR comment bot.
- No baseline updating or pushing (that is `update-screenshots.yml`).
- No Slack alerting (that is the scheduled job's role).

## Design

### New workflow: `.github/workflows/test-visual-label.yml`

**Triggers**

- `pull_request: types: [labeled]`
- `workflow_dispatch` (manual run button)

**Job guard** (mirrors `update-screenshots.yml`)

Run only when both hold:

- `github.event.label.name == 'run-visual-tests'`
- `github.head_ref != github.event.repository.default_branch`

For `workflow_dispatch` events there is no `github.event.label`, so the guard
must tolerate manual runs — the condition allows the job when the event is
`workflow_dispatch` OR the label matches. Concretely:

```yaml
if: >
  github.event_name == 'workflow_dispatch' ||
  (github.event.label.name == 'run-visual-tests' &&
   github.head_ref != github.event.repository.default_branch)
```

**Concurrency**

```yaml
concurrency:
  group: visual-regression-run@${{ github.head_ref }}
  cancel-in-progress: true
```

Re-labeling supersedes an in-flight run for the same branch.

**Permissions**

```yaml
permissions:
  pull-requests: write # to remove the triggering label
```

No `contents: write` — this workflow never pushes.

**Steps**

1. **Remove the label** (`actions/github-script@v7`), same try/catch-404 pattern
   as `update-screenshots.yml`, so the label can be re-added to re-trigger.
   Skip gracefully on `workflow_dispatch` (no issue/label context).
2. **Checkout** head ref (`actions/checkout@v5`, `ref: ${{ github.head_ref }}`,
   `fetch-depth: 0`).
3. **Install pnpm** (`pnpm/action-setup@v4`).
4. **Setup Node** (`actions/setup-node@v6`, `node-version: 24`).
5. `pnpm install --frozen-lockfile`.
6. `pnpm test:browser:prepare --only-shell`.
7. **Run the full visual suite:**
   ```
   pnpm nx run-many -t test:visual --parallel=1 --browser.fileParallelism=false
   ```
   `run-many` (not `affected`) so nx's dependency graph never skips it — the
   point of an on-demand trigger.
8. **Upload diff artifacts on failure** (`actions/upload-artifact@v4`,
   `if: failure()`): upload `packages/**/.vitest-attachments/**` (Vitest 4
   writes failed-comparison actual/diff PNGs there; the dir is gitignored).
   Artifact name: `visual-diffs`. `if-no-files-found: ignore`.
9. **Step summary** (`$GITHUB_STEP_SUMMARY`): pass/fail note; on failure, point
   the reader to the `visual-diffs` artifact.

### Docs

Update `AGENTS.md` Definition of Done item 8 so it names the run/verify label
(`run-visual-tests`) alongside the existing update label (`update-screenshots`).

## Manual setup step (cannot be automated in-repo)

The GitHub label `run-visual-tests` must exist in the repository label set for
the trigger to be addable. Create it once:

```
gh label create run-visual-tests \
  --description "Run the visual regression suite on this PR (verify only)" \
  --color 1D76DB
```

## Testing / verification

- Workflow YAML is valid and the `if` guard covers both `labeled` and
  `workflow_dispatch` events.
- Adding the label to a test PR triggers the run; the label is removed
  automatically.
- A deliberately broken baseline produces a red check and a downloadable
  `visual-diffs` artifact containing actual/diff PNGs.
- A clean PR produces a green check and no artifact.
