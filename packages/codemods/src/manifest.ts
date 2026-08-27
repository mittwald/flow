import { minVersion, valid } from "semver";

export type DependencyField =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies";

const dependencyFields: DependencyField[] = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

export interface Manifest {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export interface FlowDependency {
  field: DependencyField;
  name: string;
  range: string;
}

/** Every Flow-line dependency the manifest declares, in field order. */
export const findFlowDependencies = (
  manifest: Manifest,
  flowPackages: string[],
): FlowDependency[] =>
  dependencyFields.flatMap((field) =>
    Object.entries(manifest[field] ?? {})
      .filter(([name]) => flowPackages.includes(name))
      .map(([name, range]) => ({ field, name, range })),
  );

/** A leading range operator, if the range has one. */
const operatorPattern = /^(\^|~|>=|<=|>|<|=)?\s*(.+)$/;

/**
 * The range moved onto `target`, keeping whatever operator it had.
 *
 * A range this cannot read — `workspace:*`, `*`, a dist-tag, a URL — is
 * returned unchanged. Rewriting it would replace a deliberate choice with a
 * guess.
 */
export const rewriteRange = (range: string, target: string): string => {
  const match = operatorPattern.exec(range.trim());
  if (!match) {
    return range;
  }

  const [, operator = "", version = ""] = match;
  return valid(version) === null ? range : `${operator}${target}`;
};

/** A copy of the manifest with every Flow dependency moved onto `target`. */
export const applyTarget = <T extends Manifest>(
  manifest: T,
  target: string,
  flowPackages: string[],
): T => {
  const updated = structuredClone(manifest);

  for (const { field, name, range } of findFlowDependencies(
    manifest,
    flowPackages,
  )) {
    const entries = updated[field];
    if (entries !== undefined) {
      entries[name] = rewriteRange(range, target);
    }
  }

  return updated;
};

/**
 * The version the consumer is on.
 *
 * The installed version is the accurate answer, so it wins. The fallback is the
 * lowest version the declared range allows, which is deliberately conservative:
 * being too low can only select _extra_ entries, and every transform is
 * idempotent, so an extra run is a no-op rather than a corruption.
 */
export const detectCurrentVersion = (
  dependencies: FlowDependency[],
  readInstalledVersion: (name: string) => string | undefined,
): string | undefined => {
  for (const { name } of dependencies) {
    const installed = readInstalledVersion(name);
    if (installed !== undefined && valid(installed) !== null) {
      return installed;
    }
  }

  for (const { range } of dependencies) {
    const lowest = minVersion(range);
    if (lowest !== null) {
      return lowest.version;
    }
  }

  return undefined;
};
