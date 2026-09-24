/**
 * What the Vue side does not reproduce, and why.
 *
 * This list is the report the harness produces. Everything not on it must
 * render a host tree identical to React's. Every entry is matched by name, and
 * a full run fails when one no longer names a corpus file or scenario (see
 * `dev/react-parity/staleKnownGaps.ts`) — so an entry cannot outlive what it
 * exempts.
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
    "The scenarios define a React Wrapper component and build their list with typedList<T>(), which is a factory rather than a component the converter can map. A Vue List exists — src/tests/List.browser.test.ts drives it against the same host.",
};

export const unsupportedScenarios: Record<string, string> = {
  "FileField upload one": "The scenario defines a React Wrapper component.",
  "FileField upload multiple":
    "The scenario defines a React Wrapper component.",
  "Modal in ContextMenu": "The scenario defines a React component.",
  Notification: "The scenario defines a React component.",
  Section: "The scenario defines a React component with useState.",
  "Section growing inside a LayoutCard":
    "The scenario defines a React component with useState.",
  IntlProvider:
    "There is no Vue IntlProvider: React's sets the locale for what renders locally, and a Vue app renders nothing locally. useLanguage() reports the host's.",
};

/**
 * Scenarios that render, but make the host build a different tree. These are
 * the real gaps in the binding — and the entries are self-cleaning: a scenario
 * whose screenshots all match again fails the run, so a closed gap cannot keep
 * its exemption. An entry exempts the whole scenario, so keep the reason
 * concrete enough to tell which screenshot it is about.
 */
export const divergingScenarios: Record<string, string> = {
  LightBox:
    "Opened, the Vue LightBox has no `flow--light-box--content` wrapper and no `flow--light-box--actions` close button, and its ActionGroup buttons are `primary` where React's are `light-static`.",
  "LightBox with Gallery":
    "Opened, the Vue LightBox wraps the gallery in neither `flow--light-box--content` nor `flow--light-box--gallery`, and has no close button.",
  "Modal default":
    "Opened, a Section in the Vue Modal's Content keeps its `h2` heading; React's Modal renders it as `h3`.",
  "Modal offCanvas":
    "Opened, the Vue Modal leaves its ColumnLayout unconfigured (no `flow--modal--column-layout`, columns `1fr 1fr` / `1fr 1fr 1fr` instead of `1fr` / `2fr 1fr`), its AccentBox without `flow--modal--accent-box`, and a Section's heading at `h2` instead of `h3`.",
  "Modal in Section Header":
    "With the ContextMenu's Modal open, the Vue Modal's heading carries the enclosing Section's `flow--section--heading`; React's Modal keeps the Section's props away from it.",
};

/** The corpus appends the environment's label to every test name. */
export const scenarioNameOf = (testName: string): string =>
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
