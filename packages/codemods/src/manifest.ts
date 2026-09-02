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

/**
 * Fields `upgrade` may rewrite. `peerDependencies` is deliberately absent: a
 * peer range is the author's statement about which versions their package works
 * with, not a version they install. Moving `^1.0.0` to `^1.0.14` would narrow
 * what _their_ consumers are allowed to install — a breaking change to someone
 * else's package, made silently by a command they ran to update their own. Only
 * they can decide that, so `upgrade` reports the range and leaves it.
 */
const writableFields: DependencyField[] = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
];

/** Whether `upgrade` may rewrite a dependency, or only report it. */
export const isWritable = (dependency: FlowDependency): boolean =>
  writableFields.includes(dependency.field);

/**
 * A copy of the manifest with every writable Flow dependency moved onto
 * `target`. Peer ranges are left as they are — see `writableFields`.
 */
export const applyTarget = <T extends Manifest>(
  manifest: T,
  target: string,
  flowPackages: string[],
): T => {
  const updated = structuredClone(manifest);

  for (const dependency of findFlowDependencies(manifest, flowPackages)) {
    if (!isWritable(dependency)) {
      continue;
    }
    const entries = updated[dependency.field];
    if (entries !== undefined) {
      entries[dependency.name] = rewriteRange(dependency.range, target);
    }
  }

  return updated;
};

/**
 * The version the consumer is on.
 *
 * The installed version is the accurate answer, so it wins. The fallback is the
 * lowest version the declared range allows, which is deliberately conservative:
 * being too low can only select _extra_ entries.
 *
 * That is safe because a transform must be harmless against code it has nothing
 * to do with — not because it is idempotent. Idempotency only proves a second
 * pass over its own output changes nothing; it says nothing about an
 * era-specific transform meeting code from a later era.
 * `imports-to-package-root` needed an explicit leave-alone set to earn this.
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
