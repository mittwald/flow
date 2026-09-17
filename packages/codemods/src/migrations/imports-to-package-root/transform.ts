import type { Transform } from "jscodeshift";

/**
 * Subpaths this transform must leave alone. Two groups, and they are different
 * kinds of fact.
 *
 * **Subpaths the package still exports.** alpha.28 collapsed 94 subpath exports
 * onto the package root, and performing that collapse is this transform's whole
 * job — but it did it with a catch-all `else`, so every subpath introduced
 * _after_ alpha.28 was collateral. That stayed invisible while selection had a
 * lower bound; it no longer has one (see `selectEntries`), so the transform now
 * reaches current code, where flattening `all-layered.css` silently turns a
 * stylesheet import into a JS one and flattening `mittwald-password-tools-js`
 * moves `Rule` onto a root that does not export it.
 *
 * **Subpaths another entry owns.** `password-tools` is renamed to
 * `mittwald-password-tools-js` by `password-tools-subpath-renamed`, whose
 * `since` sorts it _after_ this entry. Flattening it first leaves that
 * migration nothing to find, and both report success.
 *
 * Matched exactly, not by prefix: `react-hook-form/useFoo` still collapses onto
 * `react-hook-form`, which is what alpha.28 did to it.
 *
 * `transform.test.ts` beside this file holds the first group against the
 * package's real `exports` map, so a new subpath cannot quietly become
 * collateral again.
 */
const keptSubpaths = new Set([
  // the current export surface
  "internal",
  "flr-universal",
  "tunnel",
  "nextjs",
  "react-hook-form",
  "mittwald-password-tools-js",
  "all.css",
  "all-layered.css",
  "component-index",
  "doc-properties",
  // owned by password-tools-subpath-renamed
  "password-tools",
]);

/**
 * Splits a bundler's asset query or fragment off a specifier. `all.css?url` is
 * the subpath `all.css`, requested as a URL — not a subpath named
 * `all.css?url`. Matching the whole string carried the suffix past the
 * leave-alone set and into the catch-all below, which rewrote `import
 * flowStyles from "…/all.css?url"` into a named import of a JS export that does
 * not exist, and `import "…/all-layered.css?inline"` into a side-effect import
 * of the package root — stylesheet gone, no error anywhere.
 */
const splitAssetSuffix = (subpath: string): [string, string] => {
  const suffixAt = subpath.search(/[?#]/);
  return suffixAt === -1
    ? [subpath, ""]
    : [subpath.slice(0, suffixAt), subpath.slice(suffixAt)];
};

const importsToPackageRootTransform: Transform = (fileInfo, { j }) => {
  const flowPackage = "@mittwald/flow-react-components";

  const root = j(fileInfo.source, {
    parser: "ts",
  });

  root
    .find(j.ImportDeclaration)
    .filter((i) => String(i.node.source.value).startsWith(`${flowPackage}/`))
    .forEach((i) => {
      const specifiers = i.node.specifiers ?? [];
      const importPath = String(i.node.source.value);
      const [importRelativePath, assetSuffix] = splitAssetSuffix(
        importPath.slice(flowPackage.length + 1),
      );

      if (keptSubpaths.has(importRelativePath)) {
        return;
      }

      if (
        importRelativePath === "all.css" ||
        importRelativePath === "globals.css" ||
        importRelativePath === "global.css"
      ) {
        i.node.source.value = `${flowPackage}/all.css${assetSuffix}`;
        return;
      }

      // Everything below rewrites a *module* import: it moves the specifier
      // onto a JS entry and turns a default specifier into a named one. An
      // asset import survives neither, and a suffix reaching this point names a
      // path this transform cannot resolve to an export — leave it to a human.
      if (assetSuffix !== "") {
        return;
      }

      if (importRelativePath.startsWith("react-hook-form")) {
        i.node.source.value = `${flowPackage}/react-hook-form`;
      } else if (importRelativePath.startsWith("nextjs")) {
        i.node.source.value = `${flowPackage}/nextjs`;
      } else {
        i.node.source.value = flowPackage;
      }

      specifiers.forEach((s, i) => {
        if (
          s.type === "ImportDefaultSpecifier" ||
          s.type === "ImportSpecifier"
        ) {
          // `name` is typed `string | Identifier` in ast-types; for the
          // specifiers handled here it is always the plain name.
          const name = String(
            (s.type === "ImportDefaultSpecifier"
              ? s.local?.name
              : s.imported?.name) ?? "",
          );

          specifiers[i] = {
            ...s,
            type: "ImportSpecifier",
            imported: {
              type: "Identifier",
              name,
            },
          };
        }
      });
    });

  return root.toSource();
};

export default importsToPackageRootTransform;
