import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");

/**
 * Environment variable selecting which installed old version the cross-version
 * remote server builds its remote document against. When unset, the first
 * manifest target is used.
 */
export const CROSS_VERSION_ENV = "FLOW_CROSS_VERSION";

interface ManifestTarget {
  category: string;
  version: string;
  installPath: string;
}

interface Manifest {
  packageName: string;
  targets: ManifestTarget[];
}

export interface CrossVersionTarget {
  /** The selected old version, e.g. `0.2.0-alpha.883`. */
  version: string;
  /**
   * Absolute path to the installed old `@mittwald/flow-remote-react-components`
   * package directory.
   */
  installPath: string;
}

const manifestPath = join(packageRoot, "cross-version.manifest.json");

const readManifest = (): Manifest => {
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  } catch {
    throw new Error(
      `cross-version.manifest.json not found at ${manifestPath}. ` +
        `Run \`pnpm nx test:cross-version:prepare remote-react-components\` first.`,
    );
  }
};

/**
 * Resolve which installed old version the cross-version remote server should
 * serve. Reads `cross-version.manifest.json` (the source of truth for which old
 * versions are installed) and selects the version named by the
 * `FLOW_CROSS_VERSION` env var, defaulting to the first manifest target when
 * unset. Throws a clear error if `FLOW_CROSS_VERSION` names a version that is
 * not a manifest target (typo / stale value / not installed).
 */
export const resolveCrossVersionTarget = (): CrossVersionTarget => {
  const manifest = readManifest();

  if (manifest.targets.length === 0) {
    throw new Error(
      "cross-version.manifest.json has no targets. " +
        "Run `pnpm nx test:cross-version:prepare remote-react-components` first.",
    );
  }

  const requested = process.env[CROSS_VERSION_ENV];

  const target = requested
    ? manifest.targets.find((t) => t.version === requested)
    : manifest.targets[0];

  if (!target) {
    const available = manifest.targets.map((t) => t.version).join(", ");
    throw new Error(
      `${CROSS_VERSION_ENV}="${requested}" is not a cross-version manifest ` +
        `target. Available targets: ${available}.`,
    );
  }

  return { version: target.version, installPath: target.installPath };
};
