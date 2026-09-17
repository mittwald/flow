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
export const unsupportedFiles: Record<string, string> = {
  "List.browser.test.tsx":
    "Flow's List has no Vue rebuild — every scenario in the file needs it, so the file is excluded rather than its scenarios named one by one.",
};

export const unsupportedScenarios: Record<string, string> = {
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
export const divergingScenarios: Record<string, string> = {};

/** The corpus appends the environment's label to every test name. */
const scenarioNameOf = (testName: string): string =>
  testName.replace(/\s*\(Parity\)\s*$/, "").trim();

export const divergenceReasonFor = (testName: string): string | undefined =>
  divergingScenarios[scenarioNameOf(testName)];

/** The `--exclude` globs that keep the unsupported files out of the Vue pass. */
export const excludeUnsupportedFiles = (): string[] =>
  Object.keys(unsupportedFiles).flatMap((file) => ["--exclude", `**/${file}`]);

/** The `-t` pattern that keeps the unsupported scenarios out of the Vue pass. */
export const excludeUnsupportedPattern = (): string => {
  const names = Object.keys(unsupportedScenarios).map((name) =>
    name.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&"),
  );
  return `^(?!(?:${names.join("|")}) \\(Parity\\)$)`;
};
