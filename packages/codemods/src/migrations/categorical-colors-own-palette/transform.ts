import type {
  ASTPath,
  ConditionalExpression,
  JSXExpressionContainer,
  Transform,
} from "jscodeshift";

/**
 * An expression that can be a prop's value. Deliberately not
 * `JSXExpressionContainer["expression"]`: that also admits `JSXEmptyExpression`
 * (`color={/* a comment *\/}`), which cannot be written back into a ternary
 * branch. The call site filters it out instead.
 */
type ValueNode = ConditionalExpression["consequent"];

/**
 * Renames the deprecated categorical color values by their slot in the default
 * order, not by hue: `sea-green` → `indigo`, `palatinate-blue` → `amber`,
 * `tangerine` → `teal`, `magenta` → `violet`, `tropical-indigo` → `berry`,
 * `malachite` → `green`, `azure` → `blue`, `yellow` → `cyan`, `alloy-orange` →
 * `plum`, `lime` → `red`. A chart that leaves its first series on the default
 * (`sea-green`, now `indigo`) and sets the second to `palatinate-blue` keeps
 * two different colors that way; a hue mapping would have turned the second
 * into `indigo` as well. `violet` and `green` keep their names and are left
 * alone.
 *
 * Where the values sit:
 *
 * - The `color` prop of `Area`, `Bar`, `Line` and `LegendItem` — imported, or
 *   reached as a member of what `typedCartesianChart()` returns (`const Chart =
 *   typedCartesianChart<T>(); <Chart.Area />`, also destructured).
 * - The `color` of each object literal in the `segments` of `DonutChart` and
 *   `ProgressBar`: an array literal passed directly, or a `const` in the same
 *   file holding one — the latter only when every use of that `const` is such a
 *   `segments` prop, so a shared array is never rewritten under someone else.
 *
 * The scope is deliberately narrow. Only JSX elements that resolve to one of
 * those components — imported (named or as a namespace) from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries —
 * are touched. Same-named components from other packages are left untouched.
 *
 * Only literal values are rewritten — either as the whole value
 * (`color="magenta"`, `color={"magenta"}`) or in a value position inside a
 * dynamic one (`color={cond ? "lime" : "magenta"}`, `color={override ??
 * "azure"}`). A value the transform cannot see into (`color={someVariable}`) is
 * left alone.
 */
const categoricalColorsOwnPaletteTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const renames: Record<string, string> = {
    "sea-green": "indigo",
    "palatinate-blue": "amber",
    tangerine: "teal",
    magenta: "violet",
    "tropical-indigo": "berry",
    malachite: "green",
    azure: "blue",
    yellow: "cyan",
    "alloy-orange": "plum",
    lime: "red",
  };
  /** Components whose `color` prop takes a categorical color. */
  const colorComponents = new Set(["Area", "Bar", "Line", "LegendItem"]);
  /** Components whose `segments` objects carry a categorical `color`. */
  const segmentsComponents = new Set(["DonutChart", "ProgressBar"]);
  /** What `typedCartesianChart()` returns that takes a categorical `color`. */
  const chartMembers = new Set(["Area", "Bar", "Line"]);
  const chartFactory = "typedCartesianChart";

  const isAffected = (name: string): boolean =>
    colorComponents.has(name) || segmentsComponents.has(name);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  /** The replacement for a renamed string literal, if `node` is one. */
  const renamedLiteral = (node: unknown): string | undefined => {
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
  const rewriteValuePositions = (node: ValueNode): ValueNode => {
    const renamed = renamedLiteral(node);
    if (renamed !== undefined) {
      return j.stringLiteral(renamed);
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

  /** `[…] as const` and `[…] satisfies T` are still the array literal. */
  const unwrapTypeAssertions = (node: unknown): unknown => {
    let current = node as { type?: string; expression?: unknown } | null;
    while (
      current?.type === "TSAsExpression" ||
      current?.type === "TSSatisfiesExpression"
    ) {
      current = current.expression as typeof current;
    }
    return current;
  };

  /** Renames the `color` of every object literal in a `segments` array. */
  const rewriteSegments = (node: unknown): void => {
    const array = unwrapTypeAssertions(node);
    if (!j.ArrayExpression.check(array)) {
      return;
    }
    for (const element of array.elements) {
      if (!j.ObjectExpression.check(element)) {
        continue;
      }
      for (const property of element.properties) {
        if (
          (property.type !== "ObjectProperty" &&
            property.type !== "Property") ||
          property.computed
        ) {
          continue;
        }
        const key = property.key;
        const isColor =
          (key.type === "Identifier" && key.name === "color") ||
          ((key.type === "StringLiteral" || key.type === "Literal") &&
            key.value === "color");
        if (isColor) {
          property.value = rewriteValuePositions(
            property.value as ValueNode,
          ) as typeof property.value;
        }
      }
    }
  };

  const root = j(fileInfo.source, { parser: "tsx" });

  // Local JSX identifier -> canonical component name (resolves `as` aliases).
  const localToComponent = new Map<string, string>();
  // Local names of `import * as Flow` namespace imports from a Flow package.
  const flowNamespaces = new Set<string>();
  // Local names `typedCartesianChart` is imported as.
  const chartFactories = new Set<string>();

  root
    .find(j.ImportDeclaration)
    .filter((path) => isFlowImport(String(path.node.source.value)))
    .forEach((path) => {
      for (const specifier of path.node.specifiers ?? []) {
        if (
          specifier.type === "ImportSpecifier" &&
          specifier.imported.type === "Identifier"
        ) {
          const imported = String(specifier.imported.name);
          const local = String(specifier.local?.name ?? imported);
          if (isAffected(imported)) {
            localToComponent.set(local, imported);
          } else if (imported === chartFactory) {
            chartFactories.add(local);
          }
        } else if (
          specifier.type === "ImportNamespaceSpecifier" &&
          specifier.local
        ) {
          flowNamespaces.add(String(specifier.local.name));
        }
      }
    });

  if (
    localToComponent.size === 0 &&
    flowNamespaces.size === 0 &&
    chartFactories.size === 0
  ) {
    return fileInfo.source;
  }

  // Local names holding what `typedCartesianChart()` returns.
  const chartObjects = new Set<string>();

  root.find(j.VariableDeclarator).forEach((path) => {
    const init = path.node.init;
    if (!j.CallExpression.check(init)) {
      return;
    }
    const callee = init.callee;
    const isFactory =
      (callee.type === "Identifier" && chartFactories.has(callee.name)) ||
      (callee.type === "MemberExpression" &&
        !callee.computed &&
        callee.object.type === "Identifier" &&
        flowNamespaces.has(callee.object.name) &&
        callee.property.type === "Identifier" &&
        callee.property.name === chartFactory);
    if (!isFactory) {
      return;
    }

    const id = path.node.id;
    if (id.type === "Identifier") {
      chartObjects.add(id.name);
    } else if (id.type === "ObjectPattern") {
      // const { Area, Bar: ChartBar } = typedCartesianChart<T>();
      for (const property of id.properties) {
        if (
          (property.type === "ObjectProperty" ||
            property.type === "Property") &&
          !property.computed &&
          property.key.type === "Identifier" &&
          chartMembers.has(property.key.name) &&
          property.value.type === "Identifier"
        ) {
          localToComponent.set(property.value.name, property.key.name);
        }
      }
    }
  });

  // The `segments={…}` containers on a Flow `DonutChart`/`ProgressBar`.
  const flowSegments = new Set<JSXExpressionContainer>();
  // `segments={name}` references, resolved once every container is known.
  const segmentReferences: ASTPath[] = [];

  root.find(j.JSXOpeningElement).forEach((path) => {
    const name = path.node.name;

    let component: string | undefined;
    if (name.type === "JSXIdentifier") {
      component = localToComponent.get(name.name);
    } else if (
      name.type === "JSXMemberExpression" &&
      name.object.type === "JSXIdentifier" &&
      name.property.type === "JSXIdentifier"
    ) {
      const member = name.property.name;
      if (flowNamespaces.has(name.object.name) && isAffected(member)) {
        component = member;
      } else if (
        chartObjects.has(name.object.name) &&
        chartMembers.has(member)
      ) {
        component = member;
      }
    }

    if (!component) {
      return;
    }
    const prop = colorComponents.has(component) ? "color" : "segments";

    (path.node.attributes ?? []).forEach((attribute, index) => {
      if (
        attribute.type !== "JSXAttribute" ||
        attribute.name.type !== "JSXIdentifier" ||
        attribute.name.name !== prop
      ) {
        return;
      }

      const value = attribute.value;

      if (prop === "segments") {
        if (value?.type !== "JSXExpressionContainer") {
          return;
        }
        flowSegments.add(value);
        if (value.expression.type === "Identifier") {
          segmentReferences.push(
            path.get("attributes", index, "value", "expression") as ASTPath,
          );
        } else {
          rewriteSegments(value.expression);
        }
        return;
      }

      // color="magenta"
      const renamed = renamedLiteral(value);
      if (renamed !== undefined) {
        attribute.value = j.stringLiteral(renamed);
        return;
      }

      // color={"magenta"}, and every value position inside a dynamic value:
      // color={cond ? "magenta" : "x"}, color={fallback ?? "magenta"}.
      if (
        value?.type === "JSXExpressionContainer" &&
        value.expression.type !== "JSXEmptyExpression"
      ) {
        value.expression = rewriteValuePositions(value.expression);
      }
    });
  });

  /**
   * Whether an identifier named like a binding actually reads it — as opposed
   * to a property name (`a.segments`, `{ segments: 1 }`), which only shares the
   * spelling. Anything not excluded here counts as a read, so an unusual use
   * keeps the array untouched instead of rewriting it.
   */
  const isRead = (path: ASTPath): boolean => {
    const parent = path.parent?.node as
      { type: string; computed?: boolean; shorthand?: boolean } | undefined;
    const node = path.node;
    if (!parent) {
      return true;
    }
    if (
      (parent.type === "MemberExpression" ||
        parent.type === "OptionalMemberExpression") &&
      (parent as { property?: unknown }).property === node &&
      !parent.computed
    ) {
      return false;
    }
    if (
      (parent.type === "ObjectProperty" ||
        parent.type === "Property" ||
        parent.type === "ClassProperty" ||
        parent.type === "TSPropertySignature" ||
        parent.type === "ObjectMethod" ||
        parent.type === "ClassMethod") &&
      (parent as { key?: unknown }).key === node &&
      !parent.computed &&
      !parent.shorthand
    ) {
      return false;
    }
    return true;
  };

  const handledDeclarators = new Set<unknown>();

  for (const reference of segmentReferences) {
    const name = (reference.node as { name: string }).name;
    const scope = reference.scope?.lookup(name);
    const bindings = scope?.getBindings()[name] as ASTPath[] | undefined;
    if (!scope || bindings?.length !== 1) {
      continue;
    }
    const binding = bindings[0] as ASTPath;
    const declarator = binding.parent?.node;
    const declaration = binding.parent?.parent?.node;
    if (
      !j.VariableDeclarator.check(declarator) ||
      declarator.id !== binding.node ||
      !j.VariableDeclaration.check(declaration) ||
      declaration.kind !== "const" ||
      handledDeclarators.has(declarator)
    ) {
      continue;
    }
    handledDeclarators.add(declarator);

    // `export const segments = […]` is read elsewhere, out of sight.
    if (
      binding.parent?.parent?.parent?.node.type === "ExportNamedDeclaration"
    ) {
      continue;
    }

    const readsOnlyAsSegments = root
      .find(j.Identifier, { name })
      .filter(
        (path) =>
          // ast-types counts `JSXIdentifier` (`<X segments />`) as an `Identifier`.
          path.node.type === "Identifier" &&
          path.node !== binding.node &&
          isRead(path) &&
          path.scope?.lookup(name) === scope,
      )
      .every((path) => {
        const container = path.parent?.node;
        return (
          j.JSXExpressionContainer.check(container) &&
          flowSegments.has(container)
        );
      });

    if (readsOnlyAsSegments) {
      rewriteSegments(declarator.init);
    }
  }

  return root.toSource();
};

export default categoricalColorsOwnPaletteTransform;
