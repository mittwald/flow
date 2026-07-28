import type { ComponentDoc } from "react-docgen-typescript";
import {
  deriveComponentStatus,
  type DerivedComponentStatus,
} from "./deriveComponentStatus";

export type DerivedStatusRegistry = Record<string, DerivedComponentStatus>;

/**
 * Builds the complete, sorted status registry from parsed component docs. Every
 * component with a displayName is listed explicitly (ADR §4: completeness lets
 * a future guard distinguish "removed" from "stable").
 */
export const buildStatusRegistry = (
  components: Pick<ComponentDoc, "displayName" | "tags">[],
): DerivedStatusRegistry => {
  const registry: DerivedStatusRegistry = {};

  const sorted = [...components]
    .filter((component) => component.displayName)
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  for (const component of sorted) {
    registry[component.displayName] = deriveComponentStatus(component.tags);
  }

  return registry;
};
