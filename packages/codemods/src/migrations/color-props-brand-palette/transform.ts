import type { ConditionalExpression, Transform } from "jscodeshift";

/**
 * An expression that can be a prop's value. Deliberately not
 * `JSXExpressionContainer["expression"]`: that also admits `JSXEmptyExpression`
 * (`color={/* a comment *\/}`), which cannot be written back into a ternary
 * branch. The call site filters it out instead.
 */
type ValueNode = ConditionalExpression["consequent"];

/**
 * Renames the deprecated `color` values of `Badge`, `Avatar`, `Icon` and
 * `Color`, and the deprecated `backgroundColor` values of `AccentBox`, to the
 * values that render the same: `violet` → `lilac` and `teal` → `sage`
 * everywhere, on `Badge` also `green` → `success`, `orange` → `warning` and
 * `red` → `danger`, and on `AccentBox` also `gradient` → `gradient-navy` and
 * `green` → `sage`. `Avatar`'s `green` is left alone: its replacement `sage`
 * looks different, so that is a decision, not a rename.
 *
 * The scope is deliberately narrow. Only JSX elements that resolve to one of
 * those components — imported (named or as a namespace) from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries —
 * are touched. Same-named components from other packages are left untouched.
 *
 * Only literal values are rewritten — either as the whole value (`color="red"`,
 * `color={"red"}`) or in a value position inside a dynamic one (`color={cond ?
 * "neutral" : "red"}`, `color={override ?? "red"}`). A value the transform
 * cannot see into (`color={someVariable}`) is left alone.
 */
const colorPropsBrandPaletteTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const decorative: Record<string, string> = { violet: "lilac", teal: "sage" };
  const renamesByComponent: Record<string, Record<string, string>> = {
    Badge: {
      ...decorative,
      green: "success",
      orange: "warning",
      red: "danger",
    },
    Avatar: decorative,
    Icon: decorative,
    Color: decorative,
    AccentBox: { ...decorative, gradient: "gradient-navy", green: "sage" },
  };
  /** The prop holding the color, where it is not `color`. */
  const propByComponent: Record<string, string> = {
    AccentBox: "backgroundColor",
  };
  const affectedComponents = new Set(Object.keys(renamesByComponent));

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  /** The replacement for a renamed string literal, if `node` is one. */
  const renamedLiteral = (
    node: unknown,
    renames: Record<string, string>,
  ): string | undefined => {
    if (!node || typeof node !== "object" || !("type" in node)) {
      return undefined;
    }
    const { type } = node as { type: string };
    const value = (node as { value?: unknown }).value;
    return (type === "StringLiteral" || type === "Literal") &&
      typeof value === "string" &&
      Object.hasOwn(renames, value)
      ? renames[value]
      : undefined;
  };

  /**
   * Rewrites every renamed literal sitting in a position whose value can reach
   * the prop: the expression itself, both branches of a ternary, and the
   * operands of `??`/`||` — plus the right operand of `&&`, since `&&` yields
   * its left operand only when that operand is falsy and a non-empty string
   * never is. A literal anywhere else is not a value that reaches the prop (an
   * object key, an index into a lookup table) and stays as it is.
   *
   * This cannot move into a shared module: the CLI loads this file straight out
   * of the published package, which ships only
   * `src/migrations/**\/transform.ts` — see this package's AGENTS.md.
   */
  const rewriteValuePositions = (
    node: ValueNode,
    renames: Record<string, string>,
  ): ValueNode => {
    const renamed = renamedLiteral(node, renames);
    if (renamed !== undefined) {
      return j.stringLiteral(renamed);
    }
    if (node?.type === "ConditionalExpression") {
      node.consequent = rewriteValuePositions(node.consequent, renames);
      node.alternate = rewriteValuePositions(node.alternate, renames);
      return node;
    }
    if (node?.type === "LogicalExpression") {
      if (node.operator !== "&&") {
        node.left = rewriteValuePositions(node.left, renames);
      }
      node.right = rewriteValuePositions(node.right, renames);
      return node;
    }
    return node;
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

    let component: string | undefined;
    if (name.type === "JSXIdentifier") {
      component = localToComponent.get(name.name);
    } else if (
      name.type === "JSXMemberExpression" &&
      name.object.type === "JSXIdentifier" &&
      name.property.type === "JSXIdentifier" &&
      flowNamespaces.has(name.object.name) &&
      affectedComponents.has(name.property.name)
    ) {
      component = name.property.name;
    }

    const renames = component && renamesByComponent[component];
    if (!component || !renames) {
      return;
    }
    const prop = propByComponent[component] ?? "color";

    for (const attribute of path.node.attributes ?? []) {
      if (
        attribute.type !== "JSXAttribute" ||
        attribute.name.type !== "JSXIdentifier" ||
        attribute.name.name !== prop
      ) {
        continue;
      }

      const value = attribute.value;

      // color="red"
      const renamed = renamedLiteral(value, renames);
      if (renamed !== undefined) {
        attribute.value = j.stringLiteral(renamed);
        continue;
      }

      // color={"red"}, and every value position inside a dynamic value:
      // color={cond ? "red" : "x"}, color={fallback ?? "red"}.
      if (
        value?.type === "JSXExpressionContainer" &&
        value.expression.type !== "JSXEmptyExpression"
      ) {
        value.expression = rewriteValuePositions(value.expression, renames);
      }
    }
  });

  return root.toSource();
};

export default colorPropsBrandPaletteTransform;
