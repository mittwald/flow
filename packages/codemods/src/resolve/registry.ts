import registryUrl from "registry-url";

export interface RegistryVersions {
  versions: string[];
  distTags: Record<string, string>;
}

/** Only the fields this CLI reads out of a packument. */
interface Packument {
  versions?: Record<string, unknown>;
  "dist-tags"?: Record<string, string>;
}

/**
 * The registry that actually serves `@mittwald`, from the consumer's npm
 * config.
 *
 * Hardcoding `registry.npmjs.org` would be wrong for anyone behind a corporate
 * mirror or a scoped private registry — `npm view` works for them because npm
 * reads their `.npmrc`, and a CLI that ignores it would fail or, worse, answer
 * from the wrong source.
 */
const registryFor = (packageName: string): string => {
  const scope = packageName.startsWith("@")
    ? packageName.slice(0, packageName.indexOf("/"))
    : undefined;
  return registryUrl(scope).replace(/\/$/, "");
};

/**
 * Every published version of a package, plus its dist-tags.
 *
 * Uses the abbreviated packument media type: the full document for a package
 * with hundreds of releases is megabytes, and none of it is needed here.
 */
export const fetchVersions = async (
  packageName: string,
): Promise<RegistryVersions> => {
  // One wrapper for every failure, not just the HTTP one: `fetch` itself rejects
  // on DNS failure or no connection, and `json()` rejects on a malformed body.
  // Without this those surface as a bare "fetch failed", which says nothing
  // about what the CLI was trying to do.
  let packument: Packument;
  try {
    const response = await fetch(`${registryFor(packageName)}/${packageName}`, {
      headers: { accept: "application/vnd.npm.install-v1+json" },
    });

    if (!response.ok) {
      throw new Error(`the registry answered ${response.status}`);
    }

    packument = (await response.json()) as Packument;
  } catch (error) {
    throw new Error(
      `Could not read ${packageName} from the npm registry: ${
        error instanceof Error ? error.message : error
      }`,
      { cause: error },
    );
  }

  return {
    versions: Object.keys(packument.versions ?? {}),
    distTags: packument["dist-tags"] ?? {},
  };
};

export interface PackageVersions extends RegistryVersions {
  name: string;
}

/**
 * Every declared Flow dependency's packument, fetched concurrently.
 *
 * `fetchVersions` is injected rather than imported directly so this stays
 * testable without a network stub — `UpgradeDeps.fetchVersions` is what
 * production and tests both pass in here.
 */
export const fetchAllVersions = async (
  names: string[],
  fetchOne: (name: string) => Promise<RegistryVersions>,
): Promise<PackageVersions[]> =>
  Promise.all(names.map(async (name) => ({ name, ...(await fetchOne(name)) })));

/**
 * The versions every one of `packages` has published.
 *
 * Fixed versioning keeps every Flow package's `package.json` version equal, but
 * Lerna publishes only the packages that actually changed, so what reaches the
 * registry diverges per package (#2887, accepted risk). A target version is
 * only safe to write onto every declared dependency when it is one of these —
 * the intersection, not any single package's list.
 */
export const intersectVersions = (packages: PackageVersions[]): string[] => {
  const [first, ...rest] = packages;
  if (first === undefined) {
    return [];
  }
  return first.versions.filter((version) =>
    rest.every((pkg) => pkg.versions.includes(version)),
  );
};
