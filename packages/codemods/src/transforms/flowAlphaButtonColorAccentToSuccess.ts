import type { Transform } from "jscodeshift";

/**
 * Renames the `color="accent"` prop value to `color="success"` on `Button` and
 * `SubmitButton`.
 *
 * The scope is deliberately narrow. Only JSX elements that resolve to one of
 * those components — imported (named or as a namespace) from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries —
 * are touched. Same-named components from other packages are left untouched.
 * Only the literal value `"accent"` is rewritten (`color="accent"` and
 * `color={"accent"}`); dynamic values such as `color={expr}` are skipped.
 */
const flowAlphaButtonColorAccentToSuccessTransform: Transform = (
  fileInfo,
  { j },
) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set(["Button", "SubmitButton"]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  const isAccentLiteral = (node: unknown): boolean => {
    if (!node || typeof node !== "object" || !("type" in node)) {
      return false;
    }
    const { type } = node as { type: string };
    return (
      (type === "StringLiteral" || type === "Literal") &&
      (node as { value?: unknown }).value === "accent"
    );
  };

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

    for (const attribute of path.node.attributes ?? []) {
      if (
        attribute.type !== "JSXAttribute" ||
        attribute.name.type !== "JSXIdentifier" ||
        attribute.name.name !== "color"
      ) {
        continue;
      }

      const value = attribute.value;

      // color="accent"
      if (isAccentLiteral(value)) {
        attribute.value = j.stringLiteral("success");
        continue;
      }

      // color={"accent"}
      if (
        value?.type === "JSXExpressionContainer" &&
        isAccentLiteral(value.expression)
      ) {
        value.expression = j.stringLiteral("success");
      }
    }
  });

  return root.toSource();
};

export default flowAlphaButtonColorAccentToSuccessTransform;
