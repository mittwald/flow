import { existsSync, readFileSync } from "node:fs";
import { URL } from "node:url";

/*
 * Where `installProIcons.ts` puts FontAwesome Pro. Shared with
 * `next.config.js`, which bundles the package when it is there.
 */
export const proIconsDir = new URL("../.pro-icons/", import.meta.url);

export const proIconsPackage = new URL(
  "node_modules/@fortawesome/sharp-regular-svg-icons/",
  proIconsDir,
);

/** @returns {string | undefined} */
export const readProIconsVersion = () => {
  const manifest = new URL("package.json", proIconsPackage);
  return existsSync(manifest)
    ? JSON.parse(readFileSync(manifest, "utf8")).version
    : undefined;
};
