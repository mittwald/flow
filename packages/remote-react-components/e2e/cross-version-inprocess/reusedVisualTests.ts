// The visual test corpus reused UNMODIFIED through the in-process CrossVersion
// environment. The comparison is STRUCTURE-ONLY (structuralHtml strips all
// attributes): a test qualifies as long as the current host builds the same
// element tree from the old remote output.
//
// Version gating lives in the tests themselves: a test whose component or
// output didn't exist in an old version wraps itself in
// `test.skipIf(crossVersion({ below: "<v>" }))` (see @/tests/lib/environments — the
// cross-version harness injects the real predicate). There is no exclude list
// here; every file is included on every version and the per-test skip decides.
export const REUSED_VISUAL_TESTS: string[] = [
  "src/tests/visual/*.browser.test.tsx",
];
