export type DerivedComponentStatusLevel = "beta" | "stable" | "deprecated";

export interface DerivedComponentStatus {
  level: DerivedComponentStatusLevel;
  isNew: boolean;
}

const parseFlowStatusTokens = (raw: string | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

/**
 * Derives a component's lifecycle status from its component-level JSDoc tags,
 * as captured by react-docgen-typescript. This is the single place ADR 0003's
 * "tags → status" rule lives.
 */
export const deriveComponentStatus = (
  tags: Record<string, string> = {},
): DerivedComponentStatus => {
  const tokens = parseFlowStatusTokens(tags.flowStatus);
  const isDeprecated = "deprecated" in tags;

  const level: DerivedComponentStatusLevel = isDeprecated
    ? "deprecated"
    : tokens.includes("beta")
      ? "beta"
      : "stable";

  return { level, isNew: tokens.includes("new") };
};
