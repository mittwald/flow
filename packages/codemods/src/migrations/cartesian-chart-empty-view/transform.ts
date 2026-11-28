import type { Transform } from "jscodeshift";

/**
 * Wraps a component reference passed to `CartesianChart`'s `emptyView` in JSX
 * (alpha.676): `emptyView={EmptyState}` → `emptyView={<EmptyState />}`.
 *
 * The rewrite is only decidable when the source says the identifier is a
 * component, so that — not its casing — is the gate. A PascalCase name is a
 * convention, not evidence: `emptyView={Placeholder}` is just as plausibly a
 * variable already holding an element, and wrapping that produces `<Placeholder
 * />` on a non-component, which compiles nowhere and is worse than leaving the
 * prop alone. The transform therefore rewrites an identifier only when the file
 * resolves it to one of:
 *
 * - An import binding (named, default, aliased or namespace),
 * - A `function` or `class` declaration,
 * - A `const`/`let` initialised with a function or arrow function.
 *
 * Everything else stays, including an identifier declared as `const Empty =<div
 * />` — already an element, nothing to wrap — and one this file cannot resolve
 * at all.
 *
 * Scope matches its neighbours': JSX elements resolving to `CartesianChart`,
 * imported named, aliased, or through a namespace, from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries.
 *
 * Two shapes it cannot reach, both named in `apply`: a chart built through
 * `typedCartesianChart<T>()`, whose local binding is a call result rather than
 * an import, and a spread carrying `emptyView`.
 */
const cartesianChartEmptyViewTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set(["CartesianChart"]);

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

  /**
   * Every name this file binds to something that is callable as a component.
   *
   * Collected once, over the whole file rather than the enclosing scope: a
   * component is declared at module level in practice, and a name shadowed
   * inside a function by something that is _not_ a component would only make
   * this decline, never rewrite wrongly — the set is used as permission, not as
   * a lookup.
   */
  const componentNames = new Set<string>();

  root
    .find(j.ImportDeclaration)
    .forEach((path) =>
      (path.node.specifiers ?? []).forEach(
        (specifier) =>
          specifier.local && componentNames.add(String(specifier.local.name)),
      ),
    );

  root
    .find(j.FunctionDeclaration)
    .forEach(
      (path) => path.node.id && componentNames.add(String(path.node.id.name)),
    );

  root
    .find(j.ClassDeclaration)
    .forEach(
      (path) => path.node.id && componentNames.add(String(path.node.id.name)),
    );

  root.find(j.VariableDeclarator).forEach((path) => {
    const init = path.node.init;
    if (
      path.node.id.type === "Identifier" &&
      (init?.type === "ArrowFunctionExpression" ||
        init?.type === "FunctionExpression")
    ) {
      componentNames.add(String(path.node.id.name));
    }
  });

  let changed = false;

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
        attribute.name.name !== "emptyView"
      ) {
        continue;
      }

      const value = attribute.value;
      if (value?.type !== "JSXExpressionContainer") {
        continue;
      }

      const expression = value.expression;
      if (
        expression.type !== "Identifier" ||
        !componentNames.has(expression.name)
      ) {
        continue;
      }

      attribute.value = j.jsxExpressionContainer(
        j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier(expression.name), [], true),
        ),
      );
      changed = true;
    }
  });

  // Returning the source untouched keeps this file out of the "changed" count.
  return changed ? root.toSource() : fileInfo.source;
};

export default cartesianChartEmptyViewTransform;
