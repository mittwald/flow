import type { Transform } from "jscodeshift";

/**
 * Moves the background value of `AccentBox` from `color` to `backgroundColor`
 * (alpha.786).
 *
 * `color` did not go away, it changed meaning: it used to set the background
 * (`"blue" | "green" | "gradient" | "neutral"`) and now sets the content color
 * (`"default" | "dark" | "light" | "dark-static" | "light-static"`). A blanket
 * rename would therefore break every element that already uses the new meaning.
 * The transform decides per value instead: a value from the new content-color
 * union stays on `color`, every other literal moves to `backgroundColor`.
 *
 * The scope is deliberately narrow. Only JSX elements that resolve to
 * `AccentBox` — imported (named or as a namespace) from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries —
 * are touched.
 *
 * Two cases are left alone, because both are undecidable without knowing the
 * value:
 *
 * - Values it cannot read (`color={expression}`), and expressions that mix both
 *   meanings (`color={flag ? "blue" : "dark"}`). The same expression means the
 *   background in old code and the content color in new code, and a mix has no
 *   single correct answer. An expression whose every value position is a
 *   literal on the same side of the split _is_ decidable and gets renamed:
 *   `color={flag ? "blue" : "green"}`.
 * - An element that already carries `backgroundColor`. Moving `color` there would
 *   silently overwrite the explicit value.
 *
 * Both keep their `color` prop and need a look by hand.
 */
const accentBoxColorToBackgroundColorTransform: Transform = (
  fileInfo,
  { j },
) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set(["AccentBox"]);
  /** Values `color` still accepts — everything else was a background color. */
  const contentColors = new Set([
    "default",
    "dark",
    "light",
    "dark-static",
    "light-static",
  ]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  /** The value of a string literal, or `undefined` for anything dynamic. */
  const literalValue = (node: unknown): string | undefined => {
    if (!node || typeof node !== "object" || !("type" in node)) {
      return undefined;
    }
    const { type } = node as { type: string };
    if (type !== "StringLiteral" && type !== "Literal") {
      return undefined;
    }
    const { value } = node as { value?: unknown };
    return typeof value === "string" ? value : undefined;
  };

  /**
   * Every literal that could become this attribute's value, or `undefined` when
   * any of those positions is something we cannot read. The positions are the
   * expression itself, both ternary branches, and the operands of `??`/`||` —
   * plus only the right operand of `&&`, since `&&` yields its left operand
   * only when that operand is falsy and a non-empty string never is.
   *
   * A list, not a single value, because this transform decides per attribute,
   * not per literal: `color={flag ? "blue" : "dark"}` mixes a background with a
   * content colour, and no single rename is right for both.
   */
  const valueLiterals = (node: unknown): string[] | undefined => {
    const literal = literalValue(node);
    if (literal !== undefined) {
      return [literal];
    }
    if (!node || typeof node !== "object" || !("type" in node)) {
      return undefined;
    }
    const typed = node as {
      type: string;
      operator?: string;
      consequent?: unknown;
      alternate?: unknown;
      left?: unknown;
      right?: unknown;
    };
    if (typed.type === "ConditionalExpression") {
      const consequent = valueLiterals(typed.consequent);
      const alternate = valueLiterals(typed.alternate);
      return consequent && alternate
        ? [...consequent, ...alternate]
        : undefined;
    }
    if (typed.type === "LogicalExpression") {
      const right = valueLiterals(typed.right);
      if (right === undefined) {
        return undefined;
      }
      if (typed.operator === "&&") {
        return right;
      }
      const left = valueLiterals(typed.left);
      return left ? [...left, ...right] : undefined;
    }
    return undefined;
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

    const attributes = path.node.attributes ?? [];

    const isNamed = (attribute: unknown, key: string): boolean =>
      !!attribute &&
      typeof attribute === "object" &&
      (attribute as { type?: string }).type === "JSXAttribute" &&
      (attribute as { name?: { type?: string; name?: string } }).name?.type ===
        "JSXIdentifier" &&
      (attribute as { name?: { name?: string } }).name?.name === key;

    // An explicit `backgroundColor` is the new API already — never overwrite it.
    if (attributes.some((attribute) => isNamed(attribute, "backgroundColor"))) {
      return;
    }

    for (const attribute of attributes) {
      if (!isNamed(attribute, "color") || attribute.type !== "JSXAttribute") {
        continue;
      }

      const value = attribute.value;

      const literals =
        value?.type === "JSXExpressionContainer"
          ? valueLiterals(value.expression)
          : valueLiterals(value);

      if (literals === undefined || literals.length === 0) {
        continue;
      }

      // All-or-nothing. Every value has to be a background colour for the
      // rename to be right; all content colours means the element already uses
      // the new meaning, and a mix has no single correct answer.
      const backgrounds = literals.filter(
        (literal) => !contentColors.has(literal),
      );
      if (backgrounds.length !== literals.length) {
        continue;
      }

      attribute.name = j.jsxIdentifier("backgroundColor");
    }
  });

  return root.toSource();
};

export default accentBoxColorToBackgroundColorTransform;
