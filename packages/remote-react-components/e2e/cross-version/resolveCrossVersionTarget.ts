import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");

/**
 * Environment variable selecting which version of
 * `@mittwald/flow-remote-react-components` the remote document is built
 * against.
 *
 * - Unset → the first manifest target (an installed old version)
 * - `current` → this workspace's own `src` (used to generate the reference HTML
 *   the old versions are compared against)
 * - A version string → that specific installed old version (must be a manifest
 *   target)
 */
export const CROSS_VERSION_ENV = "FLOW_CROSS_VERSION";

/** Sentinel value of `FLOW_CROSS_VERSION` selecting the workspace `src`. */
export const CURRENT_SENTINEL = "current";

interface ManifestTarget {
  category: string;
  version: string;
  installPath: string;
}

interface Manifest {
  packageName: string;
  targets: ManifestTarget[];
}

export type CrossVersionTarget =
  | {
      /** Reserved sentinel; the remote document uses the workspace `src`. */
      version: typeof CURRENT_SENTINEL;
      isCurrent: true;
    }
  | {
      /** The selected installed old version, e.g. `0.2.0-alpha.883`. */
      version: string;
      isCurrent: false;
      /**
       * Absolute path to the installed old
       * `@mittwald/flow-remote-react-components` package directory.
       */
      installPath: string;
    };

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
 * Resolve which version of `@mittwald/flow-remote-react-components` the
 * cross-version remote server should serve. Reads
 * `cross-version.manifest.json`, honours `FLOW_CROSS_VERSION` (see
 * {@link CROSS_VERSION_ENV}), and throws a clear error if it names a version
 * that is neither `current` nor a manifest target.
 */
export const resolveCrossVersionTarget = (): CrossVersionTarget => {
  const requested = process.env[CROSS_VERSION_ENV];

  if (requested === CURRENT_SENTINEL) {
    return { version: CURRENT_SENTINEL, isCurrent: true };
  }

  const manifest = readManifest();

  if (manifest.targets.length === 0) {
    throw new Error(
      "cross-version.manifest.json has no targets. " +
        "Run `pnpm nx test:cross-version:prepare remote-react-components` first.",
    );
  }

  const target = requested
    ? manifest.targets.find((t) => t.version === requested)
    : manifest.targets[0];

  if (!target) {
    const available = manifest.targets.map((t) => t.version).join(", ");
    throw new Error(
      `${CROSS_VERSION_ENV}="${requested}" is not a cross-version manifest ` +
        `target. Available targets: ${available} (or "${CURRENT_SENTINEL}").`,
    );
  }

  return {
    version: target.version,
    isCurrent: false,
    installPath: target.installPath,
  };
};
