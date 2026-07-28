import type { ComponentDoc } from "react-docgen-typescript";
import {
  deriveComponentStatus,
  type DerivedComponentStatus,
} from "./deriveComponentStatus";

export type DerivedStatusRegistry = Record<string, DerivedComponentStatus>;

/**
 * A real Flow component display name is a PascalCase identifier: it starts with
 * an uppercase letter and contains only letters/digits. This deliberately drops
 * the non-component exports react-docgen-typescript also captures from the
 * source glob — hooks (`useX`), helpers (`getX`), qualified names
 * (`Model.method`), and camelCase test fixtures (`asyncFunction`, `validator`)
 * — none of which are components a consumer or the breaking-change guard should
 * track.
 */
export const isComponentDisplayName = (displayName: string): boolean =>
  /^[A-Z][A-Za-z0-9]*$/.test(displayName);

/**
 * Builds the status registry, scoped to Flow's curated public API surface.
 * `publicComponentNames` comes from parsePublicComponentNames(public.ts): only
 * components on that surface are tracked (ADR §4 completeness applies WITHIN
 * the public surface — internal/sub-components are badged via their parent, not
 * tracked independently).
 */
export const buildStatusRegistry = (
  components: Pick<ComponentDoc, "displayName" | "tags">[],
  publicComponentNames: ReadonlySet<string>,
): DerivedStatusRegistry => {
  const registry: DerivedStatusRegistry = {};

  const sorted = [...components]
    .filter((component) => isComponentDisplayName(component.displayName))
    .filter((component) => publicComponentNames.has(component.displayName))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  for (const component of sorted) {
    registry[component.displayName] = deriveComponentStatus(component.tags);
  }

  return registry;
};
