// Reused visual tests, run UNMODIFIED through the in-process CrossVersion
// environment. The comparison is STRUCTURE-ONLY (structuralHtml strips all
// attributes), so a test qualifies as long as the current host builds the same
// element tree from the old remote output. A genuine STRUCTURAL divergence
// across versions (not attribute drift) is the only thing that would block a
// test; scope those with testVersionSupport. The list is meant to grow.
export const REUSED_VISUAL_TESTS: string[] = [
  "src/tests/visual/Checkbox.browser.test.tsx",
  "src/tests/visual/Switch.browser.test.tsx",
  "src/tests/visual/Separator.browser.test.tsx",
  "src/tests/visual/Badge.browser.test.tsx",
  "src/tests/visual/Text.browser.test.tsx",
  "src/tests/visual/Heading.browser.test.tsx",
];

/**
 * Candidates NOT yet active, with the divergence blocking them. Move a path up
 * to REUSED_VISUAL_TESTS once its divergences are declared (intended) or
 * fixed.
 */
export const REUSED_VISUAL_TEST_CANDIDATES: string[] = [];
