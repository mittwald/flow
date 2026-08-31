import type { Transform } from "jscodeshift";

const oldPath = "@mittwald/flow-react-components/password-tools";
const newPath = "@mittwald/flow-react-components/mittwald-password-tools-js";

/**
 * Rewrites the module specifier
 * `@mittwald/flow-react-components/password-tools` to
 * `@mittwald/flow-react-components/mittwald-password-tools-js` (alpha.1000).
 *
 * Every form that names a module is covered: `import`, `import type`, `export …
 * from`, a side-effect import, `import()` and `require()`. Only that exact
 * specifier is touched — a deeper path under it never existed, so there is
 * nothing to prefix-match and no risk of rewriting an unrelated
 * `password-tools` of someone else's.
 */
const passwordToolsSubpathRenamedTransform: Transform = (fileInfo, { j }) => {
  const root = j(fileInfo.source, { parser: "tsx" });
  let changed = false;

  const rewrite = (node: { value?: unknown }): void => {
    if (node.value === oldPath) {
      node.value = newPath;
      changed = true;
    }
  };

  // import … from "…", export … from "…", import "…"
  root.find(j.ImportDeclaration).forEach((path) => rewrite(path.node.source));
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

export default passwordToolsSubpathRenamedTransform;
