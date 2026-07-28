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
 *
 * Entries sourced from `src/integrations/**` are excluded: integration
 * components (e.g. the Next.js `Link`) ship through their own package entries
 * (`./nextjs`, …), not the `.` surface, and can collide with a public component
 * of the same displayName — the deprecated Next.js `Link` must not overwrite
 * the public, non-deprecated `Link`.
 */
export const buildStatusRegistry = (
  components: (Pick<ComponentDoc, "displayName" | "tags"> &
    Partial<Pick<ComponentDoc, "filePath">>)[],
  publicComponentNames: ReadonlySet<string>,
): DerivedStatusRegistry => {
  const registry: DerivedStatusRegistry = {};

  const sorted = [...components]
    // Match the `src/integrations/` path segment regardless of absolute vs.
    // relative form or path separator: react-docgen-typescript returns
    // `filePath` absolute for some files and relative for others, so a plain
    // `.includes("/src/integrations/")` would miss the relative form.
    .filter(
      (component) =>
        !/(?:^|[\\/])src[\\/]integrations[\\/]/.test(component.filePath ?? ""),
    )
    .filter((component) => isComponentDisplayName(component.displayName))
    .filter((component) => publicComponentNames.has(component.displayName))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  for (const component of sorted) {
    registry[component.displayName] = deriveComponentStatus(component.tags);
  }

  return registry;
};
