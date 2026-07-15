/**
 * Curated cross-version visual-test subset — run once per resolved old version
 * (see `vitest.config.ts` / `crossVersionEnvironmentsPlugin.ts`) against the
 * SAME baselines the normal `Remote`/`Local` environments use.
 *
 * CURATION METHOD (empirical, not aspirational — see Task 6 report for the full
 * data): every candidate below was actually run under this cross-version config
 * against all 3 resolved old versions (0.2.0-alpha.889 / .797 / .692) and kept
 * ONLY because it came back green. This list is deliberately far short of the
 * ~10 files the brief hoped for (see "SYSTEMIC FINDING" below) — do not pad it
 * with more files without verifying them the same way, and do not delete the
 * finding below without re-verifying it no longer holds.
 *
 * SYSTEMIC FINDING (read before adding more candidates): Roughly 30 candidate
 * files were tried (all "stable primitive" components: Button, Text, Heading,
 * Badge, Checkbox, Switch, Icon, Separator, Label, Link, LoadingSpinner,
 * ProgressBar, plus every visual test file that avoids a top-level `Flex`
 * wrapper). ALL of them failed identically across ALL 3 old versions whenever
 * the test asserts on a PROP other than `children` (a color/size/boolean
 * variant, a `direction`/`gap` on `Flex`, or even a `data-testid` used later
 * for a `.click()`/`.hover()` locator). Only `children` composition reliably
 * survives the OLD-react-components + CURRENT-host pairing; screenshots show
 * correctly laid-out DOM structure and text content, but every variant prop
 * renders as its untouched default (see e.g. the Icon/Checkbox/FileCardList
 * screenshots attached to the Task 6 report) and any interaction test that
 * locates its trigger via `data-testid` times out (the attribute never gets
 * set, so the locator never resolves).
 *
 * The 4 files below only pass because none of their PIXELS depend on a prop:
 * `BigNumber` has none, `CopyButton`'s `text` prop and `LabeledValue`'s
 * `CopyButton` children only affect a clipboard value (invisible in the
 * screenshot), and `Tooltip`'s reveal is CSS `:hover`, not a remote-set
 * attribute. None of the 4 actually exercises prop-level backward compatibility
 * — they are children-only smoke tests.
 *
 * Leading hypothesis (NOT fixed here — out of this task's scope, flagged for
 * the controller): `vitest.config.ts`'s `sharedRemoteElementsAlias` forces
 * every OLD `@mittwald/flow-remote-react-components` version to call into the
 * CURRENT `@mittwald/flow-remote-elements` (a Task 4 workaround for a
 * same-realm `customElements.define` collision — see that alias's own rationale
 * comment). If the OLD react-components' prop-passing convention into
 * remote-elements changed since, forcing old callers onto the current package
 * would silently drop every prop while children (which likely use a much more
 * stable generic DOM-append path) still work — for ALL 3 old versions
 * uniformly, regardless of how old each one is. That would mean this specific
 * failure is an artifact of the harness's alias choice, not necessarily a real
 * product regression — but it also means this harness cannot currently validate
 * the thing it was built to validate. See the Task 6 report for the full
 * evidence trail and dropped-candidate list.
 *
 * KEPT (verified green across all 3 versions):
 */
export const SUBSET = [
  "src/tests/visual/BigNumber.browser.test.tsx",
  "src/tests/visual/CopyButton.browser.test.tsx",
  "src/tests/visual/LabeledValue.browser.test.tsx",
  "src/tests/visual/Tooltip.browser.test.tsx",
];
