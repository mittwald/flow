// Reused visual tests, run UNMODIFIED through the in-process CrossVersion
// environment. The comparison is STRUCTURE-ONLY (structuralHtml strips all
// attributes): a test qualifies as long as the current host builds the same
// element tree from the old remote output.
//
// The whole visual corpus is reused by glob; the two lists below subtract what
// doesn't work. REUSED_VISUAL_TESTS is intentionally a fixed glob (the target).
export const REUSED_VISUAL_TESTS: string[] = [
  "src/tests/visual/*.browser.test.tsx",
];

/**
 * Whole FILES excluded — they cannot run through this render-only harness at
 * all. A failure here happens before `testScreenshot`, so it can't be
 * version-scoped (that gates only the comparison); the whole file must go.
 *
 * INTERACTION timeout — the test drives the UI with `.click()`, but the opened
 * popover/dropdown keeps re-rendering in the one-realm setup, so Playwright's
 * "visible, enabled and stable" actionability wait never resolves:
 */
export const EXCLUDED_VISUAL_TESTS: string[] = [
  "**/AutoComplete.browser.test.tsx",
  "**/List.browser.test.tsx",
  "**/MarkdownEditor.browser.test.tsx",
  "**/PasswordCreationField.browser.test.tsx",
  "**/Select.browser.test.tsx",
  "**/Slider.browser.test.tsx",
  // RENDER error — the test uses a component that is `undefined` in an old
  // version's bundle ("Element type is invalid"), so the file can't render
  // there. LightBox fails <= alpha.883; the rest fail at alpha.686.
  "**/LightBox.browser.test.tsx",
  "**/CodeEditor.browser.test.tsx",
  "**/ContextMenu.browser.test.tsx",
  "**/ImageCropper.browser.test.tsx",
  "**/Kbd.browser.test.tsx",
  "**/IntlProvider.browser.test.tsx",
];

/**
 * Individual tests whose ELEMENT TREE genuinely changed at some point
 * (structure- only already ignores attribute drift, so these are real
 * structural changes). They are excluded for versions BELOW `fromVersion` and
 * compared from it on — `fromVersion` is the first version whose structure
 * matches current. Consumed by testVersionSupport.ts. Determined empirically
 * from the cross-version run (and, for Checkbox, a bisect).
 */
export interface VersionScopedTest {
  /** Full Vitest test name, including the "(CrossVersion)" suffix. */
  testName: string;
  fromVersion: string;
  reason: string;
}

export const VERSION_SCOPED_TESTS: VersionScopedTest[] = [
  {
    testName: "Checkbox edge cases(CrossVersion)",
    fromVersion: "0.2.0-alpha.884",
    reason:
      "CheckboxButton dropped its wrapper <div>s in alpha.884 (bisected: fails at 883, passes at 884+).",
  },
  {
    testName: "CodeBlock truncated (CrossVersion)",
    fromVersion: "0.2.0-alpha.883",
    reason: "Element tree diverges at alpha.791 and earlier.",
  },
  {
    testName: "Rating custom icon (CrossVersion)",
    fromVersion: "0.2.0-alpha.883",
    reason: "Element tree diverges at alpha.791 and earlier.",
  },
];
