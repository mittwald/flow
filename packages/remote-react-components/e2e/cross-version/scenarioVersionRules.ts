/**
 * Version-support rules for the visual scenarios in the cross-version harness —
 * the DATA only; the matching logic lives in `scenarioVersionSupport.ts`.
 *
 * By default every scenario is compared against every installed old version.
 * Some scenarios only render the same as current from a certain version onward
 * — e.g. a component's output structure evolved — and would otherwise flag a
 * non-regression. Express that positively with `minVersion` ("this scenario is
 * only comparable from version X onward"); older versions are skipped. Use
 * `skipVersions` for one-off exceptions (a specific intermediate release to
 * skip). Scenarios with no rule are always compared.
 *
 * This is the scenario-level analogue of `cross-version.exclude.json` (which
 * excludes whole broken published versions).
 */
export interface ScenarioVersionRule {
  /** Scenario module basename, as the host test derives it. */
  scenarioFile: string;
  scenarioName: string;
  /**
   * Only compare this scenario for old versions `>=` this one (the component it
   * exercises reached its current shape here). Older versions are skipped.
   */
  minVersion?: string;
  /** One-off versions to skip regardless of `minVersion`. */
  skipVersions?: string[];
  reason: string;
}

export const scenarioVersionRules: ScenarioVersionRule[] = [
  {
    scenarioFile: "Button.scenarios.tsx",
    scenarioName: "Button colors",
    minVersion: "0.2.0-alpha.791",
    reason:
      "AccentBox backgroundColor handling evolved: <= alpha.686 render a `--neutral` class variant, later versions render a custom color as an inline style. Comparable from alpha.791 onward.",
  },
];
