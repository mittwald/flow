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

### Running the Tests

First, install the required test browsers:

```sh
pnpm test:browser:prepare
```

You can then run the tests using the following command:

```sh
pnpm nx run remote-react-components:test:visual --browser.name=webkit
```

The tests run **headless** and only in Webkit. Firefox is also available as a
browser option, but it has issues with parallelized testing.

If differences are detected, corresponding screenshots are created and listed in
the test results.

In **dev mode**, a “real” browser is opened, allowing you to interact directly
with the test:

```sh
pnpm nx run remote-react-components:test:visual:dev --browser.name=webkit
```

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

Carefully review all new or updated screenshots afterward. If everything looks
correct, you can commit them.

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
(currently **Webkit**), to reduce the pipeline execution time.

In addition, visual tests are run **with all supported browsers** twice a day to
detect potential issues early.

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
  the glob; `reusedVisualTests.ts` subtracts what can't run — see below).
- **Connection:** old remote and current host run in **one realm** (shared
  `RemoteReceiver`) — cheaper, but **lower connection fidelity** than the iframe
  harness, so attribute-level serialization can differ from the real protocol.
  It also can't drive stateful **overlay interactions**: react-aria's overlay
  context is split by the aliased one-realm setup, so dropdowns/popovers don't
  open (their `.click()` never resolves) — those tests are file-excluded.
- **Comparison:** **structure only** (`structuralHtml` strips ALL attributes) —
  the element tree (tag names + nesting + text) must match.
- **COVERS:** broad backwards compatibility of the **DOM shape** — does the
  current host still build the same element tree from an old remote version's
  output, across the whole reused corpus?
- **DOES NOT COVER:** anything attribute-level — classes, inline styles, prop
  serialization form (attribute vs property), icon geometry, ARIA/id wiring. All
  of that is intentionally invisible here and is the iframe harness's job. A
  genuine **structural** divergence (an element added/removed/reordered across
  versions) is the only thing that fails; scope a legitimate one with
  `e2e/cross-version-inprocess/testVersionSupport.ts`.

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
  visual suite, so `reusedVisualTests.ts` carries two subtraction lists instead:
  - `EXCLUDED_VISUAL_TESTS` — whole **files** that can't RUN through a
    render-only harness (the failure happens before the comparison, so it can't
    be version-scoped): interaction tests whose overlay never opens, and files
    that hit a render error because they use a component `undefined` in an old
    version's bundle.
  - `VERSION_SCOPED_TESTS` — individual tests whose **element tree** genuinely
    changed, listed with the `fromVersion` they became comparable from (older
    versions skip the comparison). Since structure-only already ignores
    attribute drift, a structural diff here is a real change — confirm the
    boundary (e.g. by bisect) rather than guessing, and **never** weaken
    `structuralHtml.ts` to hide an unexplained one.

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

Both cross-version harnesses run in the **scheduled** visual workflow
(`test-visual-scheduled.yml`), twice a day — **not** on pull requests (they do
network installs of published versions). Failures alert Slack.
