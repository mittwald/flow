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
  const response = await fetch(`${registry}/${packageName}`, {
    headers: { accept: "application/vnd.npm.install-v1+json" },
  });

  if (!response.ok) {
    throw new Error(
      `Could not read ${packageName} from the npm registry (${response.status}).`,
    );
  }

  const packument = (await response.json()) as Packument;

  return {
    versions: Object.keys(packument.versions ?? {}),
    distTags: packument["dist-tags"] ?? {},
  };
};
