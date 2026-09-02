import type { ComponentDoc } from "react-docgen-typescript";
import {
  STATUS_EXPORT_ENTRIES,
  specifierOf,
} from "../status-registry/exportEntries";
import { isUnderSourceRoot } from "../status-registry/buildStatusRegistry";
import { isConsumerProp, isInternalProp, propType } from "./filterProps";
import {
  remoteAvailabilityOf,
  type RemoteAvailability,
} from "./remoteAvailability";

export interface IndexedProp {
  type: string;
  required?: true;
  default?: string;
  description?: string;
  deprecated?: true;
}

export interface IndexedComponent {
  importFrom: string[];
  level: "beta" | "stable" | "deprecated";
  isNew?: true;
  deprecationNotice?: string;
  description?: string;
  remote: RemoteAvailability;
  props: Record<string, IndexedProp>;
}

export type ComponentIndex = Record<string, IndexedComponent>;

export interface StatusEntry {
  level: "beta" | "stable" | "deprecated";
  isNew: boolean;
  deprecationNotice?: string;
}

/** The prop-level `@deprecated` tag — not `@deprecatedValues a, b`. */
const deprecatedRegex = /@deprecated(?!\w)/;

const byKey = <T>(entries: [string, T][]): Record<string, T> =>
  Object.fromEntries(entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

const splitStatusKey = (
  key: string,
): { specifier: string; name: string } | undefined => {
  const separator = key.indexOf("#");
  if (separator <= 0 || separator === key.length - 1) {
    return undefined;
  }
  return { specifier: key.slice(0, separator), name: key.slice(separator + 1) };
};

const indexProps = (component: ComponentDoc): Record<string, IndexedProp> =>
  byKey(
    Object.entries(component.props)
      .filter(
        ([name, prop]) =>
          name && prop && !isInternalProp(prop) && isConsumerProp(name, prop),
      )
      .map(([name, prop]) => {
        const indexed: IndexedProp = { type: propType(name, prop) };
        if (prop.required) {
          indexed.required = true;
        }
        const defaultValue = prop.defaultValue?.value;
        if (defaultValue !== undefined && defaultValue !== null) {
          indexed.default = String(defaultValue);
        }
        const description = prop.description.trim();
        if (description) {
          indexed.description = description;
        }
        if (deprecatedRegex.test(prop.description)) {
          indexed.deprecated = true;
        }
        return [name, indexed];
      }),
  );

export const buildComponentIndex = (
  components: ComponentDoc[],
  statusRegistry: Record<string, StatusEntry>,
  packageName: string,
  flrUniversalNames: Set<string> = new Set(),
): ComponentIndex => {
  const sourceRootBySpecifier = new Map(
    STATUS_EXPORT_ENTRIES.map((entry) => [
      specifierOf(entry.key, packageName),
      entry.sourceRoot,
    ]),
  );

  interface Resolved {
    name: string;
    source: ComponentDoc;
    specifiers: string[];
    status: StatusEntry;
  }

  const resolved = new Map<ComponentDoc, Resolved>();

  for (const [key, status] of Object.entries(statusRegistry)) {
    const parsed = splitStatusKey(key);
    if (!parsed) {
      continue;
    }
    const { specifier, name } = parsed;

    const sourceRoot = sourceRootBySpecifier.get(specifier);
    if (sourceRoot === undefined) {
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

    const existing = resolved.get(source);
    if (existing) {
      existing.specifiers.push(specifier);
      if (specifier === packageName) {
        existing.status = status;
      }
      continue;
    }
    resolved.set(source, { name, source, specifiers: [specifier], status });
  }

  const nameCounts = new Map<string, number>();
  for (const entry of resolved.values()) {
    nameCounts.set(entry.name, (nameCounts.get(entry.name) ?? 0) + 1);
  }

  return byKey(
    [...resolved.values()].map(({ name, source, specifiers, status }) => {
      const importFrom = [...specifiers].sort();
      const props = indexProps(source);
      const entry: IndexedComponent = {
        importFrom,
        level: status.level,
        remote: remoteAvailabilityOf(
          source,
          flrUniversalNames,
          Object.keys(props),
        ),
        props,
      };
      if (status.isNew) {
        entry.isNew = true;
      }
      if (status.deprecationNotice) {
        entry.deprecationNotice = status.deprecationNotice;
      }
      const description = source.description.trim();
      if (description) {
        entry.description = description;
      }

      const isAmbiguous =
        (nameCounts.get(name) ?? 0) > 1 && !importFrom.includes(packageName);

      return [isAmbiguous ? `${importFrom[0]}#${name}` : name, entry];
    }),
  );
};
