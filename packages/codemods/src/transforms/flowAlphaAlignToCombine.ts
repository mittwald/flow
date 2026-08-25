import type { Transform } from "jscodeshift";

/**
 * Renames the `Align` component to `Combine`, and `AlignProps` to
 * `CombineProps`.
 *
 * Only names imported from `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components` (including their subpath entries)
 * are touched, so a same-named import from another package is left alone. An
 * `Align` imported under a local alias (`import { Align as Row }`) keeps its
 * alias — only the imported name changes. Namespace usages (`<Flow.Align />`,
 * `Flow.AlignProps`) are rewritten as well.
 */
const flowAlphaAlignToCombineTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const renames = new Map([
    ["Align", "Combine"],
    ["AlignProps", "CombineProps"],
  ]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  const root = j(fileInfo.source, { parser: "tsx" });

  /** Local identifiers that refer to a renamed export, mapped to the new name. */
  const localRenames = new Map<string, string>();
  /** Local names of `import * as Flow` namespace imports from a Flow package. */
  const flowNamespaces = new Set<string>();

  root
    .find(j.ImportDeclaration)
    .filter((path) => isFlowImport(String(path.node.source.value)))
    .forEach((path) => {
      for (const specifier of path.node.specifiers ?? []) {
        if (
          specifier.type === "ImportNamespaceSpecifier" &&
          specifier.local?.name
        ) {
          flowNamespaces.add(String(specifier.local.name));
          continue;
        }

        if (
          specifier.type !== "ImportSpecifier" ||
          specifier.imported.type !== "Identifier"
        ) {
          continue;
        }

        const imported = specifier.imported.name;
        const renamed = renames.get(imported);
        if (!renamed) {
          continue;
        }

        // Mutate in place so an `import type` / `type X` modifier survives.
        const local = String(specifier.local?.name ?? imported);
        specifier.imported.name = renamed;
        if (local === imported) {
          localRenames.set(local, renamed);
          if (specifier.local) {
            specifier.local.name = renamed;
          }
        }
        // An aliased `Align as Row` keeps `Row` and needs no further change.
      }
    });

  if (localRenames.size === 0 && flowNamespaces.size === 0) {
    return fileInfo.source;
  }

  /**
   * `JSXIdentifier` extends `Identifier`, so this one pass covers JSX tags,
   * value references and type references alike. Positions where the name is not
   * a reference to the import — an object key, a member's property, a JSX
   * attribute name — are skipped.
   */
  root.find(j.Identifier).forEach((path) => {
    const parent = path.parent.node;

    const isNamespaceMember =
      (parent.type === "MemberExpression" ||
        parent.type === "JSXMemberExpression") &&
      parent.property === path.node;

    if (isNamespaceMember) {
      const object = parent.object;
      if (object.type === "Identifier" || object.type === "JSXIdentifier") {
        const renamed = renames.get(path.node.name);
        if (renamed && flowNamespaces.has(String(object.name))) {
          path.node.name = renamed;
        }
      }
      return;
    }

    if (
      parent.type === "ImportSpecifier" ||
      parent.type === "JSXAttribute" ||
      ((parent.type === "ObjectProperty" || parent.type === "Property") &&
        parent.key === path.node &&
        !parent.computed)
    ) {
      return;
    }

    const renamed = localRenames.get(path.node.name);
    if (renamed) {
      path.node.name = renamed;
    }
  });

  return root.toSource();
};

export default flowAlphaAlignToCombineTransform;
