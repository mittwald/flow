import type { ComponentDoc } from "react-docgen-typescript";
import {
  deriveComponentStatus,
  type DerivedComponentStatus,
} from "./deriveComponentStatus";

export type DerivedStatusRegistry = Record<string, DerivedComponentStatus>;

/**
 * One export entry's resolved component names + the source root each lives
 * under.
 */
export interface StatusRegistryEntry {
  specifier: string;
  components: { name: string; sourceRoot: string }[];
}

type SourceComponent = Pick<ComponentDoc, "displayName" | "tags"> &
  Partial<Pick<ComponentDoc, "filePath">>;

/**
 * A real Flow component display name is a PascalCase identifier — starts with
 * an uppercase letter, letters/digits only. Drops non-component exports
 * react-docgen also captures (hooks `useX`, helpers `getX`, `Model.method`,
 * camelCase fixtures, lowercase barrel segments like `icons`).
 */
export const isComponentDisplayName = (displayName: string): boolean =>
  /^[A-Z][A-Za-z0-9]*$/.test(displayName);

/**
 * True when `filePath` lies under `sourceRoot`, matched as a path segment
 * regardless of absolute/relative form or separator: react-docgen-typescript
 * returns `filePath` absolute for some files and relative for others, so a
 * plain substring check is not reliable.
 */
export const isUnderSourceRoot = (
  filePath: string | undefined,
  sourceRoot: string,
): boolean => {
  if (!filePath) {
    return false;
  }
  const segments = sourceRoot
    .split("/")
    .map((segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[\\\\/]");
  return new RegExp(`(?:^|[\\\\/])${segments}[\\\\/]`).test(filePath);
};

/**
 * Builds the status registry keyed by public import specifier
 * (`"<specifier>#<name>"`). For each `(entry, name)`, the source component is
 * the doc-properties entry with that `displayName` whose `filePath` is under
 * the entry's `sourceRoot` — this disambiguates same-named components across
 * export surfaces (e.g. the public `Link` vs. the Next.js integration `Link`).
 * Names with no such source (e.g. a react-aria re-export with no Flow doc) are
 * skipped.
 */
export const buildStatusRegistry = (
  components: SourceComponent[],
  entries: StatusRegistryEntry[],
): DerivedStatusRegistry => {
  const registry: DerivedStatusRegistry = {};

  for (const entry of entries) {
    for (const { name, sourceRoot } of entry.components) {
      if (!isComponentDisplayName(name)) {
        continue;
      }
      const source = components.find(
        (component) =>
          component.displayName === name &&
          isUnderSourceRoot(component.filePath, sourceRoot),
      );
      if (!source) {
        continue;
      }
      registry[`${entry.specifier}#${name}`] = deriveComponentStatus(
        source.tags,
      );
    }
  }

  return registry;
};
