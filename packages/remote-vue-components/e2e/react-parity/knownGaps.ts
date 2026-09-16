/**
 * What the Vue side does not reproduce, and why.
 *
 * This list is the report the harness produces. Everything not on it must
 * render a host tree identical to React's.
 */

/**
 * Scenarios that cannot be expressed in Vue at all, so the Vue pass does not
 * run them — the runner filters them out by name.
 *
 * Most define a React component of their own (`useState`, a local `Wrapper`).
 * That is React logic rather than a remote tree, and no amount of work on the
 * binding would change it: a cross-framework corpus can only contain scenarios
 * that describe what to render, not how React holds state while rendering it.
 */
export const unsupportedScenarios: Record<string, string> = {
  "List items": "Flow's List has no Vue rebuild.",
  "List tiles": "Flow's List has no Vue rebuild.",
  "List table": "Flow's List has no Vue rebuild.",
  "List edge cases - list view": "Flow's List has no Vue rebuild.",
  "List edge cases - tile view": "Flow's List has no Vue rebuild.",
  "List edge cases - column layout": "Flow's List has no Vue rebuild.",
  "List date range filter": "Flow's List has no Vue rebuild.",
  "List empty views": "Flow's List has no Vue rebuild.",
  "List empty search views": "Flow's List has no Vue rebuild.",
  "FileField upload one": "The scenario defines a React Wrapper component.",
  "FileField upload multiple":
    "The scenario defines a React Wrapper component.",
  "Modal in ContextMenu": "The scenario defines a React component.",
  Notification: "The scenario defines a React component.",
  Section: "The scenario defines a React component with useState.",
  IntlProvider:
    "There is no Vue IntlProvider: React's sets the locale for what renders locally, and a Vue app renders nothing locally. useLanguage() reports the host's.",
};

/**
 * Scenarios that render, but make the host build a different tree. These are
 * the real gaps in the binding — and the entries are self-cleaning: one that
 * starts matching fails the run, so a closed gap cannot keep its exemption.
 */
export const divergingScenarios: Record<string, string> = {
  "Modal confirmOnClose":
    "The Vue Modal has no confirmOnClose. The confirmation belongs to Flow's Action model, which the rebuild leaves out — see USAGE.md.",
};

/** The corpus appends the environment's label to every test name. */
const scenarioNameOf = (testName: string): string =>
  testName.replace(/\s*\(Parity\)\s*$/, "").trim();

export const divergenceReasonFor = (testName: string): string | undefined =>
  divergingScenarios[scenarioNameOf(testName)];

/** The `-t` pattern that keeps the unsupported scenarios out of the Vue pass. */
export const excludeUnsupportedPattern = (): string => {
  const names = Object.keys(unsupportedScenarios).map((name) =>
    name.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&"),
  );
  return `^(?!(?:${names.join("|")}) \\(Parity\\)$)`;
};
