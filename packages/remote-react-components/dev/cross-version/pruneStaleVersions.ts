import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * Removes every entry under `installRoot` that is not one of `keepVersions`,
 * and returns the removed names.
 *
 * `installRoot` is the cached `.cross-version` directory. Installs are skipped
 * when present but never removed otherwise, so without this every version that
 * ever was a target stays in the cache. Pass the full resolved target set: a
 * version pruned here is reinstalled by the next job that targets it.
 */
export const pruneStaleVersions = (
  installRoot: string,
  keepVersions: readonly string[],
): string[] => {
  if (!existsSync(installRoot)) {
    return [];
  }
  const keep = new Set(keepVersions);
  const stale = readdirSync(installRoot).filter((name) => !keep.has(name));
  for (const name of stale) {
    rmSync(join(installRoot, name), { recursive: true, force: true });
  }
  return stale;
};
