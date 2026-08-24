// Twin of `FlowComponentStatusLevel` in `src/status/types.ts` — the `dev`/`src`
// rootDir split forbids a shared import, so keep both structurally identical.
export type DerivedComponentStatusLevel = "beta" | "stable" | "deprecated";

// Twin of `FlowComponentStatus` in `src/status/types.ts` — keep both structurally
// identical (see note on `DerivedComponentStatusLevel` above).
export interface DerivedComponentStatus {
  level: DerivedComponentStatusLevel;
  isNew: boolean;
  /** Migration text from a component-level `@deprecated` tag (deprecated only). */
  deprecationNotice?: string;
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
  const isBeta = tokens.includes("beta");
  const isNew = tokens.includes("new");

  let level: DerivedComponentStatusLevel = "stable";
  if (isDeprecated) {
    level = "deprecated";
  } else if (isBeta) {
    level = "beta";
  }

  const status: DerivedComponentStatus = { level, isNew };

  if (isDeprecated) {
    // Prettier wraps a long `@deprecated` line, and the wrap survives into the
    // tag text — so collapse whitespace to keep the notice one sentence.
    const notice = tags.deprecated?.replace(/\s+/g, " ").trim();
    if (notice) {
      status.deprecationNotice = notice;
    }
  }

  return status;
};
