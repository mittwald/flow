import type { Transform } from "jscodeshift";

/**
 * Renames the `action` prop to `onAction` on `Action`.
 *
 * The scope is deliberately narrow. Only JSX elements that resolve to `Action`
 * — imported (named or as a namespace) from `@mittwald/flow-react-components`
 * or `@mittwald/flow-remote-react-components`, including their subpath entries
 * — are touched. Same-named components from other packages are left untouched,
 * and so is the `action` attribute of a plain `<form>`.
 *
 * An element that already carries `onAction` keeps it and only loses the stale
 * `action` prop, which mirrors what the runtime fallback does: an explicit
 * `onAction` wins.
 */
const flowAlphaActionPropToOnActionTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set(["Action"]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  const root = j(fileInfo.source, { parser: "tsx" });

  // Local JSX identifier -> canonical component name (resolves `as` aliases).
  const localToComponent = new Map<string, string>();
  // Local names of `import * as Flow` namespace imports from a Flow package.
  const flowNamespaces = new Set<string>();

  root
    .find(j.ImportDeclaration)
    .filter((path) => isFlowImport(String(path.node.source.value)))
    .forEach((path) => {
      for (const specifier of path.node.specifiers ?? []) {
        if (
          specifier.type === "ImportSpecifier" &&
          specifier.imported.type === "Identifier" &&
          affectedComponents.has(specifier.imported.name)
        ) {
          localToComponent.set(
            String(specifier.local?.name ?? specifier.imported.name),
            String(specifier.imported.name),
          );
        } else if (
          specifier.type === "ImportNamespaceSpecifier" &&
          specifier.local
        ) {
          flowNamespaces.add(String(specifier.local.name));
        }
      }
    });

  if (localToComponent.size === 0 && flowNamespaces.size === 0) {
    return fileInfo.source;
  }

  root.find(j.JSXOpeningElement).forEach((path) => {
    const name = path.node.name;

    let isAffected = false;
    if (name.type === "JSXIdentifier") {
      isAffected = localToComponent.has(name.name);
    } else if (
      name.type === "JSXMemberExpression" &&
      name.object.type === "JSXIdentifier" &&
      name.property.type === "JSXIdentifier"
    ) {
      isAffected =
        flowNamespaces.has(name.object.name) &&
        affectedComponents.has(name.property.name);
    }

    if (!isAffected) {
      return;
    }

    const attributes = path.node.attributes ?? [];

    const isNamed = (attribute: (typeof attributes)[number], key: string) =>
      attribute.type === "JSXAttribute" &&
      attribute.name.type === "JSXIdentifier" &&
      attribute.name.name === key;

    const hasOnAction = attributes.some((attribute) =>
      isNamed(attribute, "onAction"),
    );

    if (hasOnAction) {
      path.node.attributes = attributes.filter(
        (attribute) => !isNamed(attribute, "action"),
      );
      return;
    }

    for (const attribute of attributes) {
      if (isNamed(attribute, "action") && attribute.type === "JSXAttribute") {
        attribute.name.name = "onAction";
      }
    }
  });

  return root.toSource();
};

export default flowAlphaActionPropToOnActionTransform;
