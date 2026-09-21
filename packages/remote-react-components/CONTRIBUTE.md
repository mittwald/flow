# Contribute

## Visual Regression Testing

In the `src/tests/visual` directory, you will find visual regression tests for
most components. The goal of these tests is to detect early whether, after a
change:

1. **the visual appearance of one or more components has changed
   unintentionally** Example: A change to a design token affects more components
   than expected.

2. **components behave incorrectly** Example: A context menu no longer opens or
   is positioned incorrectly, or Buttons are not correctly positioned when used
   in the header of a Section.

### Testing Remote Components

Tests should always be executed in both the **remote** and the **local
environment**. To make this as easy as possible, predefined test environments
are available and can conveniently be used with `test.each`.

Have a look at existing tests for reference.

### Light and Dark Theme

The suite runs in **Webkit and Firefox**, and the browser also decides the theme
— instead of doubling the run time with a second theme axis:

| Browser | Theme                                                            |
| ------- | ---------------------------------------------------------------- |
| Webkit  | light                                                            |
| Firefox | dark (`data-theme="dark"`, see `dev/vitest/setupVisualTheme.ts`) |

So the `*-firefox-*.png` baselines are **dark by design**, the `*-webkit-*.png`
baselines are light. A single full run covers both themes; filtering to one
browser (`--browser.name=webkit`) only verifies one of them.

### Running the Tests

First, install the required test browsers:

```sh
pnpm test:browser:prepare
```

You can then run the tests using the following command:

```sh
pnpm nx run remote-react-components:test:visual --browser.name=webkit
```

The tests run **headless** and one file at a time. Omitting `--browser.name`
runs both browsers — and therefore both themes — as the scheduled run and the
`run-visual-tests` label do.

One file at a time is required: firefox renders no focus styling in a page that
is not the focused one, and running files in parallel leaves most of them
unfocused. It is set in the visual project's vitest config, so there is no flag
to pass.

The files also share **one tester iframe** (`isolate: false`, same config).
Vitest's default gives every file a fresh iframe and removes the previous one,
but Playwright's WebKit never releases a removed iframe's document — each
finished file left its whole realm behind (~200 MB: component library, CSS,
fonts, last render), and the unsharded `update-screenshots` run died at file 105
of 168 (#3119). One iframe also skips the per-file import of the component
library; the local full run went from 289 s to 122 s. What this means for a
test: module state persists across files. Mounted trees do not leak, because
`render` calls `cleanup()` first — anything a test hangs on `window` or
`document` does.

If differences are detected, corresponding screenshots are created and listed in
the test results.

In **dev mode**, a “real” browser is opened, allowing you to interact directly
with the test:

```sh
pnpm nx run remote-react-components:test:visual:dev --browser.name=webkit
```

#### Dev mode renders differently

A headed browser antialiases differently than a headless one, so most scenarios
fail here on small diffs that mean nothing. Use dev mode to watch and debug, and
judge screenshots from a headless run — its diff lands in the gitignored
`.vitest-attachments/…`, with reference, actual and diff side by side.

The vitest UI stays off for this project: it scales the tests into a smaller
frame, which made every screenshot fail on its dimensions.

#### Remote ≠ Local

If there are differences between local and remote rendering, separate files are
generated, for example:

- `*--Remote--1.png`
- `*--Local--1.png`

In this case, it is helpful to further inspect the rendering using **Storybook**
and the **remote demo app**.

**Do not commit these files!**

### Updating Screenshots

If you make changes to existing components or develop new components or
features, you can update the screenshots as follows:

```sh
pnpm nx run remote-react-components:test:visual:update
```

You can also filter the tests, to only run relevant tests.

```sh
pnpm nx run remote-react-components:test:visual:update NewComponent
```

Without `--browser.name` this updates the light (Webkit) **and** the dark
(Firefox) baselines.

Carefully review all new or updated screenshots afterward — both themes. If
everything looks correct, you can commit them.

Then add the `update-screenshots` label to the pull request. This ensures that
the screenshots used in CI (Linux) are updated as well.

### What and how to test?

1. **Test behavior** Interact with components in your tests and take appropriate
   screenshots. Example:
   - before opening a modal
   - after it has opened
   - after it has been closed

2. **Test states and properties** Test different properties and states of
   components. Example:
   - different variants and colors
   - states such as `hovered` (not recommended by now due to flakiness),
     `disabled`, etc. (preferably combined in a single screenshot)

3. **Test component combinations** One of Flow’s strengths is that components
   can be combined and adapt to each other dynamically. **Make sure to test
   these constellations as well!** Example: A button is placed on the right side
   of a section header and displayed in its small variant.

The best way to learn how tests are structured is to look at existing test
cases.

### Waiting for the focus

`testScreenshot`'s preamble waits for the document to stop **mutating**. A focus
move is not a mutation — `:focus` / `:focus-within` are pseudo-classes — and a
react-aria focus restore fired by an unmounting popover lands after the quiet
window anyway. Nothing in the preamble can wait for it.

So synchronize on the focus yourself, with the helpers in
`src/tests/lib/scenarioFocus.ts`, whenever a step or a capture depends on where
the focus sits:

```tsx
await userEvent.keyboard("{enter}"); // closes the calendar, restores the focus

await waitForFocusInTheScenario(); // the restore has landed

await userEvent.keyboard("{tab}");

await waitForFocusOutsideTheScenario(); // Tab has taken the focus out again

await testScreenshot("DatePicker - date selected");
```

Two situations need this:

- **A step that closes an overlay** (Escape, Enter on a calendar cell, a click
  on a menu item). react-aria restores the focus to the trigger asynchronously,
  and a key press sent into that window is undone by the restore landing after
  it — the scenario continues from a state it never asked for.
- **A capture whose reference encodes a focus ring**, or the absence of one.

Skipping the wait costs a ~1% diff in whichever environment lost the race. Both
environments share one reference, so it shows up as a random per-run failure
rather than as a race — and no amount of sleeping fixes it. `Local` renders
synchronously and usually wins, `Remote` applies every interaction a serializer
round trip late, so a green `Local` says nothing about `Remote`.

A plain `click()` or `fill()` needs no wait: the locator action resolves after
the browser has moved the focus.

### Notes on Chromium

Due to its wide adoption, Chromium would normally be a good choice as a test
browser. However, there are currently issues when running the tests in CI, where
random errors like the following occur:

```
Error: Failed to import test file
/home/runner/work/flow/flow/packages/remote-react-components/src/tests/visual/AlertBadge.browser.test.tsx

Caused by: TypeError: Failed to fetch dynamically imported module:
http://localhost:63315/home/runner/work/flow/flow/packages/remote-react-components/src/tests/visual/AlertBadge.browser.test.tsx?import&browserv=1765973079806
```

For this reason, Chromium has been disabled in the following file:
[https://github.com/mittwald/flow/blob/main/packages/core/src/vitestBrowserTestConfig.ts](https://github.com/mittwald/flow/blob/main/packages/core/src/vitestBrowserTestConfig.ts)

The current solution is to wait for an update of **Playwright**.

### CI

For pull requests, visual tests are executed **with a single browser only**
(currently **Webkit**), to reduce the pipeline execution time — which means the
regular PR run only covers the **light** theme.

In addition, visual tests are run **with all supported browsers** twice a day to
detect potential issues early. To verify both themes on a pull request, add the
`run-visual-tests` label — it runs every browser.

Every path is sharded across runners (vitest's `--shard`), because the suite is
serial by design and a single runner is the wrong unit for it. A shard still
runs its own files one at a time, in its own browser process, against the same
baselines — what it renders is identical to a single-runner run. A failure names
the shard; its diff images are in that shard's `visual-diffs-*` artifact.

## Cross-version smoke tests

Extension developers ship remote apps built against a **published** version of
`@mittwald/flow-remote-react-components`, but those apps render inside a mStudio
host that runs the **current** version. The cross-version smoke tests guard that
contract.

### Two harnesses — what each covers

Both harnesses take an **old published version's remote output**, render it
through the **current host**, and compare the resulting **host HTML** against
the current version's output (old-vs-current). Both are HTML/DOM comparisons,
**not** screenshot/pixel — neither asserts visual fidelity. They are
deliberately different in two axes: **connection fidelity** and **comparison
depth**.

#### iframe harness — high fidelity, narrow

- **Where:** `e2e/cross-version/`, corpus `src/tests/visual/*.scenarios.tsx`
  (curated, hand-written scenarios).
- **Connection:** the **real** one — the full old remote stack
  (`@mittwald/flow-remote-react-components` + its matching
  `@mittwald/flow-remote-core`) runs in a real iframe realm and talks to the
  current host over the versioned `@quilted/threads` protocol, exactly as
  production does.
- **Comparison:** **full HTML including attributes** (`normalizeHtml`, which
  only strips volatile bits — generated ids, the hidden connection iframe,
  `data-flr-*`, whitespace — keeping classes, attributes, text, and
  label↔control wiring).
- **COVERS:** attribute-accurate backwards compatibility over the real protocol
  — props serialize correctly, the host renders the same
  classes/attributes/styles for an old version as for current.
- **DOES NOT COVER:** breadth (only the curated scenarios); visual/pixel
  fidelity.

#### in-process harness — broad, structure-only

- **Where:** `e2e/cross-version-inprocess/`, corpus the **whole**
  `src/tests/visual/*.browser.test.tsx` suite, reused UNMODIFIED by injecting a
  `CrossVersion` environment in place of local/remote (`REUSED_VISUAL_TESTS` is
  the glob). It runs with the same browser config as the screenshot tests
  (1280×720 desktop viewport, en-US locale, reduced motion), so responsive
  layouts and interactions (clicking a trigger, keyboard navigation) behave the
  same as in the normal suite.
- **Connection:** old remote and current host run in **one realm** (shared
  `RemoteReceiver`) — cheaper, but **lower connection fidelity** than the iframe
  harness, so attribute-level serialization can differ from the real protocol.
  That's exactly why the comparison is structure-only.
- **Comparison:** **structure only** (`structuralHtml`) — it drops the hidden
  remote-DOM (`<flr-*>`) subtree and strips ALL attributes, so only the **host
  output's** element tree (tag names + nesting + text) must match. The `<flr-*>`
  tree is the remote side's own element graph (an implementation detail that
  changes freely between versions); what we assert is the host DOM the renderer
  builds from it.
- **COVERS:** broad backwards compatibility of the **DOM shape** — does the
  current host still build the same element tree from an old remote version's
  output, across the whole reused corpus?
- **DOES NOT COVER:** anything attribute-level — classes, inline styles, prop
  serialization form (attribute vs property), icon geometry, ARIA/id wiring. All
  of that is intentionally invisible here and is the iframe harness's job. A
  genuine **structural** divergence (an element added/removed/reordered across
  versions) is the only thing that fails; scope a legitimate one per-test with
  `test.skipIf(crossVersion({ below: "<v>" }))` (see below).

In short: **iframe = does it render _correctly_ (attributes) for a few
scenarios; in-process = does it render _at all in the same shape_ for many.**
Neither commits a baseline — the current version is re-rendered as an ephemeral
reference each run.

### Running locally

```sh
# once: install the target old versions (network) + write the manifest
pnpm nx run remote-react-components:test:cross-version:prepare

# run every installed old version against the current version (ephemeral ref)
pnpm nx run remote-react-components:test:cross-version

# run the reused visual tests through the in-process harness
pnpm nx run remote-react-components:test:cross-version-inprocess
```

`test:cross-version` loops the installed versions (one vitest run each, webkit,
headless) and prints a per-version `PASS`/`FAIL` summary, exiting non-zero if
any version fails. For local iteration, `test:cross-version:dev` opens vitest in
watch mode against the suite. `test:cross-version-inprocess` first regenerates
its ephemeral current refs, then loops over the same installed versions;
`test:cross-version-inprocess:dev` opens that harness in watch mode.

### Missing components and legitimate divergences

- **Component missing in an old version:** if a scenario uses a component that a
  given old version predates, that old render can't resolve it. The test
  **skips** that scenario for that version (logged) rather than failing — an
  extension on that old version could not have used a component that didn't
  exist yet.
- **A component's output legitimately evolved:** when the current version
  renders a different (but not broken) structure than an old one, the strict
  HTML comparison would flag it. Record it positively in
  `e2e/cross-version/scenarioVersionSupport.ts` as "this scenario is comparable
  from version X onward" (`minVersion`), plus `skipVersions` for one-off
  exceptions. Older versions are then skipped while newer in-range versions
  still get real coverage. A real diff you can't explain is a
  backwards-compatibility finding — investigate it; **never** weaken the
  normalizer (`normalizeHtml.ts`) to hide it.
- The two points above are the **iframe harness's** mechanisms
  (`scenarioVersionSupport.ts`). The **in-process harness** reuses the whole
  visual suite unmodified, so a version-bound test gates **itself** with a skip
  predicate the injected environment provides:

  ```tsx
  import { crossVersion, testEnvironments } from "@/tests/lib/environments";

  // Kbd is undefined in the alpha.686 bundle; available from alpha.791.
  test
    .skipIf(crossVersion({ below: "0.2.0-alpha.791" }))
    .each(testEnvironments)(
    "Kbd (%s)",
    /* … */
  );
  ```

  `crossVersion({ below, exclude })` returns `true` (skip) when the tested
  version is older than `below`, or is listed in `exclude` (for non-monotonic
  breakage). In the normal visual suite it is always `false`, so the test runs
  everywhere. The whole test is skipped — render, interaction, and comparison —
  which covers both causes uniformly: a **component missing** in the old bundle
  (would throw on render), and a **legitimately evolved element tree** (a real
  structural diff). Determine the boundary rather than guessing (bisect the
  installed versions), keep the one-line reason next to the test, and **never**
  weaken `structuralHtml.ts` to hide an unexplained diff.

### Which versions are tested

`dev/cross-version/prepare.ts` resolves the target versions from the published
version list (`selectTargetVersions.ts`):

- **semver categories** when a stable line exists: `previous` (nearest below
  current), `firstOfLine` (earliest on the current line),
  `latestOfPreviousLine`.
- **alpha-offset fallback** for prerelease-only histories (the current state):
  `previous` plus fixed offsets back through the candidate list (`offset-10`,
  `offset-100`, `offset-200`), skipping excluded versions.

The resolved set is written to `cross-version.manifest.json` (generated, not
committed).

#### Excluding a version (broken-window list)

Some published versions are known-broken and must never be tested. They live in
`cross-version.exclude.json`; add an entry (with a `reason`) to exclude one,
remove it to re-include. Currently excluded: **`0.2.0-alpha.889`–`895`**, which
shipped async serializers (#2596) against an externalized, unpatched
`@quilted/threads` and fail to connect by design; fixed in #2620 (`alpha.896`).

#### Publish gaps

An otherwise-valid target (often the `previous`/recent alpha) can fail to
install when its dependency tree pins a transitive `@mittwald/*` version that
was never published to npm (an `ETARGET`/404). `prepare.ts` treats this as a
best-effort skip: it logs a warning, drops the version, and continues, so a repo
publish gap doesn't block the suite. If every target drops, an empty manifest is
written and `test:cross-version` passes with a "nothing to run" warning.

### CI

The **iframe harness** runs on every pull request and push, as the
`cross-version` job in `test.yml`. It is gated on `nx affected`, so it no-ops
when nothing it covers changed, and the published versions it installs are
cached on `lerna.json`.

The **in-process harness** does not, and neither does the full per-version
matrix. Both harnesses run in the **scheduled** visual workflow
(`test-visual-scheduled.yml`) twice a day, sharded per target version. Failures
alert Slack.

#### Running them on a pull request

The PR job covers one harness against one version set. A divergence that only
the in-process harness or an older target sees is caught by the next scheduled
run — after the PR has merged. **Run everything on-demand by adding the
`run-cross-version-tests` label to the PR** (`test-cross-version-label.yml`): it
runs both harnesses against the PR branch and comments a per-version PASS/FAIL
summary. The label removes itself, so re-adding it re-runs.

**Add the label whenever you remove a component or change its rendered
structure** (a public component gone, or an element added/removed/reordered in
the host output). Such changes are exactly what produces an old-vs-current
structural divergence, so the version gates may need adjusting — a
`test.skipIf(crossVersion({ below }))` on a reused visual test, or a
`minVersion`/`skipVersions` entry in `scenarioVersionSupport.ts` (see
[Missing components and legitimate divergences](#missing-components-and-legitimate-divergences)).
The label lets you find and fix that on the PR instead of after merge.

**Dependabot PRs run both harnesses unconditionally** — no label, and a red run
blocks the auto-merge (`dependabot-auto-merge.yml`). A `react-aria` or
`react-dom` bump changes rendered structure without touching a component, which
is precisely the divergence class the PR job's single harness does not see.
