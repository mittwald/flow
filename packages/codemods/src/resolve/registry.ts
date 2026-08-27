export interface RegistryVersions {
  versions: string[];
  distTags: Record<string, string>;
}

/** Only the fields this CLI reads out of a packument. */
interface Packument {
  versions?: Record<string, unknown>;
  "dist-tags"?: Record<string, string>;
}

const registry = "https://registry.npmjs.org";

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
    const response = await fetch(`${registry}/${packageName}`, {
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
    );
  }

  return {
    versions: Object.keys(packument.versions ?? {}),
    distTags: packument["dist-tags"] ?? {},
  };
};
