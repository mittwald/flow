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
 * - Dynamic values (`color={expression}`). The same expression means the
 *   background in old code and the content color in new code.
 * - An element that already carries `backgroundColor`. Moving `color` there would
 *   silently overwrite the explicit value.
 *
 * Both keep their `color` prop and need a look by hand.
 */
const flowAlphaAccentBoxColorToBackgroundColorTransform: Transform = (
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

      // color="…" and color={"…"} — the only forms we can decide.
      const literal =
        literalValue(value) ??
        (value?.type === "JSXExpressionContainer"
          ? literalValue(value.expression)
          : undefined);

      if (literal === undefined || contentColors.has(literal)) {
        continue;
      }

      attribute.name = j.jsxIdentifier("backgroundColor");
    }
  });

  return root.toSource();
};

export default flowAlphaAccentBoxColorToBackgroundColorTransform;
