import type { Transform } from "jscodeshift";

const oldPath = "@mittwald/flow-react-components/styles";
const newPath = "@mittwald/flow-react-components/all.css";

/**
 * Rewrites the module specifier `@mittwald/flow-react-components/styles` to
 * `@mittwald/flow-react-components/all.css` (alpha.292).
 *
 * The same shape as `password-tools-subpath-renamed`: one exact specifier, in
 * every form that names a module — `import`, `import type`, `export … from`, a
 * side-effect import, `import()` and `require()`. In practice it is nearly
 * always the side-effect form (`import "…/styles"`), which is why that case is
 * the one the fixtures lead with.
 *
 * Exact match on the path, not a prefix: `./styles` was a single export with
 * nothing underneath it, so there is no deeper path to rewrite and no risk of
 * touching an unrelated `styles` of someone else's. A bundler query or fragment
 * (`?url`, `?inline`) is split off before that comparison and carried over — it
 * addresses the export, it does not name a different one.
 *
 * What this cannot reach is an `@import` in a `.css` or `.scss` file —
 * jscodeshift only walks the JavaScript and TypeScript extensions. `apply` says
 * so.
 */
const renamedCssExportTransform: Transform = (fileInfo, { j }) => {
  const root = j(fileInfo.source, { parser: "tsx" });
  let changed = false;

  // A bundler addresses an asset through a query or fragment on the specifier,
  // so `…/styles?url` is the old export requested as a URL. The rename applies
  // to it just the same: match the path, carry the suffix over. Comparing the
  // whole string leaves it pointing at an export the package no longer has.
  const rewrite = (node: { value?: unknown }): void => {
    if (typeof node.value !== "string") {
      return;
    }

    const suffixAt = node.value.search(/[?#]/);
    const [path, suffix] =
      suffixAt === -1
        ? [node.value, ""]
        : [node.value.slice(0, suffixAt), node.value.slice(suffixAt)];

    if (path !== oldPath) {
      return;
    }

    node.value = `${newPath}${suffix}`;
    changed = true;
  };

  // import … from "…", import "…"
  root.find(j.ImportDeclaration).forEach((path) => rewrite(path.node.source));

  // export … from "…", export * from "…"
  root
    .find(j.ExportNamedDeclaration)
    .forEach((path) => path.node.source && rewrite(path.node.source));
  root
    .find(j.ExportAllDeclaration)
    .forEach((path) => rewrite(path.node.source));

  // import("…") and require("…")
  root
    .find(j.CallExpression)
    .filter((path) => {
      const callee = path.node.callee;
      return (
        callee.type === "Import" ||
        (callee.type === "Identifier" && callee.name === "require")
      );
    })
    .forEach((path) => {
      const [argument] = path.node.arguments;
      if (
        argument &&
        (argument.type === "StringLiteral" || argument.type === "Literal")
      ) {
        rewrite(argument);
      }
    });

  // Returning the source untouched keeps this file out of the "changed" count.
  return changed ? root.toSource() : fileInfo.source;
};

export default renamedCssExportTransform;
