import { readFileSync } from "node:fs";
import { join } from "node:path";
import { rsort } from "semver";
import { flowPackages } from "../flowPackages.generated.js";
import {
  detectCurrentVersion,
  findFlowDependencies,
  type FlowDependency,
  type Manifest,
} from "../manifest.js";
import {
  fetchAllVersions,
  fetchVersions,
  intersectVersions,
} from "./registry.js";
import { resolveTarget } from "./target.js";

/**
 * The installed version of `name`, read from `cwd`'s `node_modules`.
 *
 * Lives here rather than in `upgrade.ts` (where it used to) because `list` now
 * resolves a range too, and both commands need the identical "what's actually
 * installed" answer — this is `resolveRange`'s default reader.
 */
export const readInstalledVersion = (
  cwd: string,
  name: string,
): string | undefined => {
  try {
    const manifest = JSON.parse(
      readFileSync(join(cwd, "node_modules", name, "package.json"), "utf8"),
    ) as { version?: string };
    return manifest.version;
  } catch {
    return undefined;
  }
};

export interface RangeDeps {
  cwd: string;
  fetchVersions: typeof fetchVersions;
  readInstalledVersion: (cwd: string, name: string) => string | undefined;
}

export const defaultRangeDeps = (cwd: string): RangeDeps => ({
  cwd,
  fetchVersions,
  readInstalledVersion,
});

export interface ResolvedRange {
  ok: true;
  manifestPath: string;
  manifestRaw: string;
  manifest: Manifest;
  dependencies: FlowDependency[];
  current: string;
  target: string;
  versions: string[];
}

export interface UnresolvedRange {
  ok: false;
  /** Human-readable, ready to print as-is. */
  reason: string;
}

export type RangeResult = ResolvedRange | UnresolvedRange;

const isEnoent = (error: unknown): boolean =>
  error instanceof Error &&
  "code" in error &&
  (error as NodeJS.ErrnoException).code === "ENOENT";

/**
 * What `revision` resolves to for the project at `cwd`.
 *
 * Reads the manifest, finds its Flow dependencies, detects the current version,
 * fetches what every dependency has actually published, and resolves `revision`
 * against the intersection — the same sequence `upgrade` always needed, now
 * shared with `list <revision>`, which uses it to answer "what would `upgrade
 * <revision>` touch?" without writing anything.
 *
 * Reports the resolution rather than judging it: an exact version or a stale
 * dist-tag can resolve at or below `current`, and this function returns that
 * target just the same. Whether that is a refusal (`upgrade`, about to write
 * files) or a legitimate answer ("nothing between here and there" — `list`) is
 * for the caller to decide. Two callers judging the same fact differently is
 * fine; two callers computing the fact differently is how they drift.
 */
export const resolveRange = async (
  revision: string,
  deps: RangeDeps,
): Promise<RangeResult> => {
  const manifestPath = join(deps.cwd, "package.json");

  let manifestRaw: string;
  try {
    manifestRaw = readFileSync(manifestPath, "utf8");
  } catch (error) {
    if (isEnoent(error)) {
      return {
        ok: false,
        reason: `No package.json found in ${deps.cwd}. Resolving "${revision}" needs one to read the current Flow version from — a bare "list" does not.`,
      };
    }
    throw error;
  }

  let manifest: Manifest;
  try {
    manifest = JSON.parse(manifestRaw) as Manifest;
  } catch (error) {
    return {
      ok: false,
      reason: `Could not parse ${manifestPath} as JSON: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }

  const dependencies = findFlowDependencies(manifest, flowPackages);

  // Destructuring the emptiness check (rather than `dependencies.length ===
  // 0`) sidesteps a `no-non-null-assertion` lint error at every later read of
  // `dependencies[0]` — `no-non-null-assertion` is an error in this repo's
  // eslint config.
  const [firstDependency] = dependencies;
  if (firstDependency === undefined) {
    return {
      ok: false,
      reason: `No Flow dependency found in ${manifestPath}. Nothing to upgrade.`,
    };
  }

  const current = detectCurrentVersion(dependencies, (name) =>
    deps.readInstalledVersion(deps.cwd, name),
  );
  if (current === undefined) {
    return {
      ok: false,
      reason: "Could not determine the Flow version this project is on.",
    };
  }

  // Fixed versioning keeps every Flow package's package.json version equal,
  // but Lerna publishes only the packages that actually changed, so what
  // reaches the registry diverges per package (#2887, accepted risk).
  // Resolving from one "anchor" dependency and writing it onto all of them can
  // pick a version some of the others never published. Resolve instead from
  // the intersection of what every declared dependency has actually
  // published, so the version this returns is always installable.
  const fetched = await fetchAllVersions(
    dependencies.map(({ name }) => name),
    deps.fetchVersions,
  );
  const versions = intersectVersions(fetched);

  if (versions.length === 0) {
    return {
      ok: false,
      reason: `${dependencies
        .map(({ name }) => name)
        .join(
          ", ",
        )} have no published version in common. Nothing to upgrade to.`,
    };
  }

  // Dist-tags come from the first declared dependency, but a tag is only kept
  // when the version it points at is one every dependency has published — an
  // unvalidated tag could otherwise resolve outside the intersection above.
  const [firstFetched] = fetched;
  const distTags = Object.fromEntries(
    Object.entries(firstFetched?.distTags ?? {}).filter(([, version]) =>
      versions.includes(version),
    ),
  );

  const target = resolveTarget({ revision, current, versions, distTags });

  if (target === undefined) {
    return {
      ok: false,
      reason: `Could not resolve "${revision}" to a version every declared Flow dependency has published. Use patch, minor, major, a dist-tag, or an exact version.`,
    };
  }

  // Defence in depth: `target` is drawn from `versions` (the intersection) or
  // from a dist-tag already validated against it, so this should never find a
  // gap. If it ever does, refuse rather than report a version some package
  // never published — naming which package lacks it and the highest version
  // every declared dependency has actually published.
  const missingFrom = fetched.find((pkg) => !pkg.versions.includes(target));
  if (missingFrom !== undefined) {
    return {
      ok: false,
      reason: `${missingFrom.name} has not published ${target}. The highest version every declared Flow dependency has published is ${
        rsort(versions)[0]
      }.`,
    };
  }

  return {
    ok: true,
    manifestPath,
    manifestRaw,
    manifest,
    dependencies,
    current,
    target,
    versions,
  };
};
