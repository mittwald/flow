import type { Transform } from "jscodeshift";

/**
 * Removes the deprecated `variant` prop from `Accordion`. The prop has no
 * effect anymore, whatever its value, so a dynamic value goes as well.
 *
 * Only JSX elements that resolve to `Accordion` — imported (named, aliased or
 * as a namespace) from `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries —
 * are touched. A same-named component from another package keeps its prop.
 *
 * Grouping accordions that used the outline to look separated is not here:
 * whether they belong into one `AccordionGroup` depends on the layout around
 * them. `apply` asks for that by hand.
 */
const accordionVariantDeprecatedTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponent = "Accordion";

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  const root = j(fileInfo.source, { parser: "tsx" });

  // Local JSX identifiers of `Accordion` (resolves `as` aliases).
  const localNames = new Set<string>();
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
          specifier.imported.name === affectedComponent
        ) {
          localNames.add(String(specifier.local?.name ?? affectedComponent));
        } else if (
          specifier.type === "ImportNamespaceSpecifier" &&
          specifier.local
        ) {
          flowNamespaces.add(String(specifier.local.name));
        }
      }
    });

  if (localNames.size === 0 && flowNamespaces.size === 0) {
    return fileInfo.source;
  }

  let changed = false;

  root.find(j.JSXOpeningElement).forEach((path) => {
    const name = path.node.name;

    const isAffected =
      (name.type === "JSXIdentifier" && localNames.has(name.name)) ||
      (name.type === "JSXMemberExpression" &&
        name.object.type === "JSXIdentifier" &&
        name.property.type === "JSXIdentifier" &&
        flowNamespaces.has(name.object.name) &&
        name.property.name === affectedComponent);

    if (!isAffected) {
      return;
    }

    const attributes = path.node.attributes ?? [];
    const remaining = attributes.filter(
      (attribute) =>
        attribute.type !== "JSXAttribute" ||
        attribute.name.type !== "JSXIdentifier" ||
        attribute.name.name !== "variant",
    );

    if (remaining.length !== attributes.length) {
      path.node.attributes = remaining;
      changed = true;
    }
  });

  return changed ? root.toSource() : fileInfo.source;
};

export default accordionVariantDeprecatedTransform;
