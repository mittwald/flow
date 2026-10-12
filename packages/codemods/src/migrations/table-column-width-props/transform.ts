import type { Transform } from "jscodeshift";

/**
 * Drops `maxWidth` from `TableColumn`, and drops `width`/`minWidth` where they
 * were `null` (alpha.956).
 *
 * Two changes with different decidability, which is why the transform covers
 * both but not equally:
 *
 * - **`maxWidth` always goes.** The prop was removed from the type, so an
 *   explicit `maxWidth` attribute is wrong whatever its value is —
 *   `maxWidth={400}` and `maxWidth={computed}` alike. Removing it does change
 *   the rendered column (there is no maximum any more); that is the migration,
 *   not a side effect.
 * - **`width` and `minWidth` only go when the source says `null`.** The type
 *   dropped `null`, and `null` meant "no explicit width", which is what
 *   omitting the prop means now. Only the literal is decidable:
 *   `width={maybeNull}` could be anything at runtime and is left alone, the way
 *   `accent-box-color-to-background-color` leaves `color={expression}`.
 *
 * The scope is the same as its neighbours': only JSX elements that resolve to
 * `TableColumn` — imported named, aliased, or through a namespace, from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries.
 *
 * A spread (`<TableColumn {...props} />`) carrying `maxWidth` is invisible
 * here. The explicit attributes beside it are still handled; `apply` names the
 * gap.
 */
const tableColumnWidthPropsTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set(["TableColumn"]);
  /** Removed from the type — an explicit attribute is wrong at any value. */
  const removedProps = new Set(["maxWidth"]);
  /** Retyped without `null` — remove only where the source literally says so. */
  const nullableProps = new Set(["width", "minWidth"]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  /**
   * Whether this JSX attribute value is the literal `null`.
   *
   * Both spellings, because which one appears depends on the parser: babel
   * emits `NullLiteral`, esprima-style parsers a `Literal` whose `value` is
   * `null`. Anything else — an identifier, a call, a ternary — is not decidable
   * from the source and stays.
   */
  const isNullLiteral = (value: unknown): boolean => {
    if (!value || typeof value !== "object" || !("type" in value)) {
      return false;
    }
    const container = value as { type: string; expression?: unknown };
    if (container.type !== "JSXExpressionContainer") {
      return false;
    }
    const expression = container.expression;
    if (
      !expression ||
      typeof expression !== "object" ||
      !("type" in expression)
    ) {
      return false;
    }
    const typed = expression as { type: string; value?: unknown };
    return (
      typed.type === "NullLiteral" ||
      (typed.type === "Literal" && typed.value === null)
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

    const attributes = path.node.attributes ?? [];
    const kept = attributes.filter((attribute) => {
      if (
        attribute.type !== "JSXAttribute" ||
        attribute.name.type !== "JSXIdentifier"
      ) {
        return true;
      }
      const attributeName = attribute.name.name;

      if (removedProps.has(attributeName)) {
        return false;
      }
      if (nullableProps.has(attributeName) && isNullLiteral(attribute.value)) {
        return false;
      }
      return true;
    });

    if (kept.length !== attributes.length) {
      path.node.attributes = kept;
      changed = true;
    }
  });

  // Returning the source untouched keeps this file out of the "changed" count.
  return changed ? root.toSource() : fileInfo.source;
};

export default tableColumnWidthPropsTransform;
