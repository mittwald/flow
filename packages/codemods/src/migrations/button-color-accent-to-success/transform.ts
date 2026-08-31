import type { ConditionalExpression, Transform } from "jscodeshift";

/**
 * An expression that can be a prop's value. Deliberately not
 * `JSXExpressionContainer["expression"]`: that also admits `JSXEmptyExpression`
 * (`color={/* a comment *\/}`), which cannot be written back into a ternary
 * branch. The call site filters it out instead.
 */
type ValueNode = ConditionalExpression["consequent"];

/**
 * Renames the `color="accent"` prop value to `color="success"` on `Button` and
 * `SubmitButton`.
 *
 * The scope is deliberately narrow. Only JSX elements that resolve to one of
 * those components — imported (named or as a namespace) from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries —
 * are touched. Same-named components from other packages are left untouched.
 *
 * Only literal `"accent"` values are rewritten — either as the whole value
 * (`color="accent"`, `color={"accent"}`) or in a value position inside a
 * dynamic one (`color={cond ? "secondary" : "accent"}`, `color={override ??
 * "accent"}`). A value the transform cannot see into (`color={someVariable}`)
 * is left alone.
 */
const buttonColorAccentToSuccessTransform: Transform = (fileInfo, { j }) => {
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

  /**
   * Rewrites every `"accent"` sitting in a position whose value can reach the
   * prop: the expression itself, both branches of a ternary, and the operands
   * of `??`/`||` — plus the right operand of `&&`, since `&&` yields its left
   * operand only when that operand is falsy and a non-empty string never is. A
   * `"accent"` anywhere else is not a value that reaches the prop (an object
   * key, an index into a lookup table) and stays as it is.
   *
   * This cannot move into a shared module: the CLI loads this file straight out
   * of the published package, which ships only
   * `src/migrations/**\/transform.ts` — see this package's AGENTS.md.
   */
  const rewriteValuePositions = (node: ValueNode): ValueNode => {
    if (isAccentLiteral(node)) {
      return j.stringLiteral("success");
    }
    if (node?.type === "ConditionalExpression") {
      node.consequent = rewriteValuePositions(node.consequent);
      node.alternate = rewriteValuePositions(node.alternate);
      return node;
    }
    if (node?.type === "LogicalExpression") {
      if (node.operator !== "&&") {
        node.left = rewriteValuePositions(node.left);
      }
      node.right = rewriteValuePositions(node.right);
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

      // color={"accent"}, and every value position inside a dynamic value:
      // color={cond ? "accent" : "x"}, color={fallback ?? "accent"}.
      if (
        value?.type === "JSXExpressionContainer" &&
        value.expression.type !== "JSXEmptyExpression"
      ) {
        value.expression = rewriteValuePositions(value.expression);
      }
    }
  });

  return root.toSource();
};

export default buttonColorAccentToSuccessTransform;
