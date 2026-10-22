# @mittwald/flow-remote-react-components — Agent Guide

**Building an mStudio extension in your own project?** Read
[USAGE.md](./USAGE.md) first — the remote surface, which props cross the
boundary, and what survives serialization. Everything below is for changing this
package.

React API used _inside_ remote apps (mStudio extensions). This package's exports
are what extension developers program against — **treat its API as a contract**
(see the remote-DOM rules in the [root AGENTS.md](../../AGENTS.md) and the full
explainer in [docs/remote-ui.md](../../docs/remote-ui.md)).

- `src/auto-generated/**` is **generated** from `packages/components` — never
  edit by hand.
- `createFlowRemoteComponent` reports **component usage** for the components the
  `flowComponent` factory does not build (54 of 131); the factory reports the
  rest. Renders that arrive through a Flow view are excluded — see the view seam
  in [docs/remote-ui.md](../../docs/remote-ui.md).
- Hand-written: `RemoteRoot` (connects to the host render root, initializes
  ext-bridge) and the `createFlowRemoteComponent` machinery.
- Richest test surface outside `components`: unit, browser, e2e and visual
  tests. **Visual tests must pass in both environments — `Local` and `Remote`**
  (see `CONTRIBUTE.md` and `src/tests/lib/environments.tsx`).
- **`Remote` goes through the real serializer.** It routes every mutation
  through `FlowThreadSerialization` over a MessageChannel
  (`src/tests/lib/serializedConnection.ts`), matching what production does, so
  each visual scenario guards the transport as well as the rendering. It used to
  hand `<RemoteRoot />` the receiver's live connection — props arrived as the
  very objects the test created, and a serializer that dropped half of them
  still passed the whole suite, which is how #2894 shipped green. Two
  consequences: **a value handed to a remote component must survive
  `postMessage`'s structured clone**, so an element-valued prop has to be a slot
  rather than a remote property (see `isSlot` in the components generator); and
  a scenario failing only in `Remote` with a blank container is usually the
  transport, not the tree.
- **New or changed rendered behavior always gets a visual test here** — add a
  new `src/tests/visual/<Name>.browser.test.tsx` or extend the existing one so
  the new prop/variant/layout is captured. Because every scenario runs in both
  `Local` and `Remote`, this single test guards the component and its remote
  path at once.
- **The screenshot preamble does not wait for the focus.** It settles on DOM
  mutations, and `:focus` / `:focus-within` are pseudo-classes — so a scenario
  whose step closes an overlay (react-aria restores the focus to the trigger
  asynchronously) or whose reference encodes a focus ring has to synchronize on
  the focus itself, with `waitForFocusInTheScenario()` /
  `waitForFocusOutsideTheScenario()` from `src/tests/lib/scenarioFocus.ts`.
  Skipping it costs a ~1% diff in whichever environment lost the race — a random
  per-run failure, not a reproducible one, because both environments share one
  reference. See `CONTRIBUTE.md` → _Waiting for the focus_.
- **Nor for CodeMirror's syntax highlighting.** What CodeMirror does not parse
  within 20ms of creating the editor gets highlighted in an idle callback 100 to
  500ms later. A scenario that renders highlighted code (`CodeBlock` or
  `CodeEditor` with a `language`, a Markdown code fence with one) calls
  `waitForHighlightedCode(<editors>)` from `src/tests/lib/codeHighlighting.ts`
  after rendering. Without it, `update-screenshots` can commit the code partly
  plain, as on #3504. See `CONTRIBUTE.md`, _Waiting for the code highlighting_.
- **The browser also selects the theme:** webkit renders light, firefox renders
  dark (`dev/vitest/setupVisualTheme.ts`), so one run covers both themes and the
  `*-firefox-*.png` baselines are dark by design. A run filtered with
  `--browser.name=<one>` only verifies one theme.
- Update visual snapshots: `pnpm nx test:visual:update remote-react-components`.
  Updating everything takes long — for a single component use
  `pnpm nx test:visual:update remote-react-components MyNewComponent`.
- **The `Remote` environment resolves the built `dist` of the remote packages,
  not their source.** After changing a component's `@flr-generate` props (which
  regenerates `src/auto-generated/**`), rebuild the remote chain before running
  or updating visual tests — otherwise the `Remote` render uses a stale `dist`,
  silently drops the new prop, and you get a misleading baseline that only fails
  on the host side. Force a fresh build with
  `pnpm nx run-many -t build -p components remote-elements remote-react-components remote-react-renderer --skip-nx-cache`,
  then update snapshots.
- Failing visual tests write `*--Local--*.png` / `*--Remote--*.png` diff
  artifacts — useful for inspection, **never commit them**. Only the baselines
  (`<Name>-<browser>-<os>.png`) belong in the repo.

## Common failures

Symptom → cause → fix for visual and cross-version tests and the screenshot
labels. Repo-wide ones are in the
[root AGENTS.md](../../AGENTS.md#common-failures).

- **Symptom:** A visual test stays red in CI after you regenerated screenshots
  locally on macOS

  **Cause:** `test:visual:update` on macOS only writes `-darwin` snapshots; CI
  gates on the `-webkit-linux` baseline

  **Fix:** Push and add the **`update-screenshots`** PR label — CI regenerates
  the Linux baseline and commits it back. Local `-darwin` regen only helps local
  macOS runs

- **Symptom:** A visual test fails with a **small** diff
  (`N pixels (ratio 0.01) differ`) and you're tempted to just add
  `update-screenshots`

  **Cause:** A small diff is not automatically noise — a real regression can
  hide in ~1% (e.g. a logical-property autofix flipping under a `direction: rtl`
  layout hack, so a toggle handle lands on the wrong side). `update-screenshots`
  bakes whatever renders _now_ into the baseline, entrenching the bug

  **Fix:** **Open the diff image** first (CI job artifacts, or local
  `.vitest-attachments/**/*-diff-*.png`). Only use `update-screenshots` for a
  change you confirmed is intentional; otherwise fix the code. Add the
  verify-only **`run-visual-tests`** label proactively on any styling/layout PR

- **Symptom:** **Scheduled cross-version tests go red _after_ your PR merged** —
  you removed a component or changed its rendered structure

  **Cause:** The `cross-version` job in `test.yml` runs the **iframe** harness
  and, for the visual tests the PR changed, the in-process harness. The rest of
  the in-process corpus runs only in the scheduled workflow. Removing a
  component or adding/removing/reordering host-output elements produces an
  old-vs-current structural divergence in tests the PR never touched, and the
  version gates weren't adjusted before merge

  **Fix:** Add the **`run-cross-version-tests`** PR label
  (`test-cross-version-label.yml`) to run both harnesses on the branch. Fix real
  divergences by gating per-version — `test.skipIf(crossVersion({ below }))` or
  a `scenarioVersionSupport.ts` entry — never by weakening the normalizers. A
  normalizer may only drop notation that carries no meaning at all (`class` is
  compared as a token set, because separators and token order are not part of
  it); anything a browser could render differently stays compared. See
  [remote-react-components/CONTRIBUTE.md](./CONTRIBUTE.md#running-them-on-a-pull-request)

- **Symptom:** A visual test that hovers before `testScreenshot` captures the
  **non-hovered** state — the diff looks as if the CSS never applied

  **Cause:** `testScreenshot` calls `setNeutralPointerPosition()` before every
  screenshot, so a CSS `:hover` state is gone by capture time. An overlay opened
  by hover survives (`Tooltip`) — its visibility is state, not a CSS `:hover`
  rule; a pure `:hover` style never does

  **Fix:** Assert the computed style in a `*.browser.test.tsx` instead of
  screenshotting it. And hover the **label**, not the `input` inside it —
  stacked icons cover the input and Playwright refuses with
  `<svg …> intercepts pointer events`

- **Symptom:** One environment of a visual scenario fails while the other
  passes, and the **`update-screenshots`** label reports _"No Screenshot Updates
  Required"_

  **Cause:** `resolveScreenshotPath` keys the reference on the screenshot
  description, not the test name, so `(Local)` and `(Remote)` share **one**
  baseline file. `--update` lets each write it in turn and the last one wins —
  where the two environments render differently, the run ends with the loser's
  image and `git status` is clean

  **Fix:** Treat it as a real divergence, not a baseline problem: the shared
  reference is the suite's way of asserting that both environments render the
  same. Capture each side on its own — delete the reference, then run the
  scenario filtered to one environment with `--update`, once per side — and
  compare the two files, then fix whichever side is wrong. A props context keyed
  on an authoring name (`ModalTrigger`) covers `Local` only — the host
  materialises what the _view_ emits (`DialogTrigger`)

- **Symptom:** A baseline for a component you never touched changes in your PR,
  or a scenario starts failing right after an unrelated PR merged with
  `update-screenshots`

  **Cause:** The `update-screenshots` label runs `pnpm test:visual --update`
  over the **whole** suite and then `git add -A` — it is not scoped to the PR's
  diff. Any scenario that is failing or flaky at that moment gets whatever
  renders then committed as its new truth

  **Fix:** Only apply the label when the suite is otherwise green, and read the
  resulting commit's file list before merging. #2945 (a CodeBlock change) took a
  tooltip-less frame of a racy `Tooltip` scenario this way and committed it as
  the `firefox-linux` baseline, contradicting the three beside it and keeping
  the scheduled run red in both environments (#2985)

- **Symptom:** The **`update-screenshots`** label pushed its commit and the PR
  now looks settled — but `main`, `visual`, `unit` and `browser` are **missing
  from the check list entirely**

  **Cause:** The label pushes as `github-actions[bot]` with the default
  `GITHUB_TOKEN`, which trips the org's workflow approval gate: every run
  created for the new head comes back
  `status=completed, conclusion=action_required` — created, never executed.
  `gh pr checks` reports nothing pending, so "wait until nothing is pending"
  reads as all-green on a commit that has no test run at all

  **Fix:** Check by SHA, not by absence of pending:
  `gh api "repos/mittwald/flow/actions/runs?head_sha=<sha>" --jq '.workflow_runs[] | "\(.name) \(.status)/\(.conclusion)"'`.
  `approve-workflow-run` returns **404** — those runs are already `completed`,
  not awaiting approval (`pending_deployments` is empty). `gh run rerun <id>`
  from a write-access account is what executes them
