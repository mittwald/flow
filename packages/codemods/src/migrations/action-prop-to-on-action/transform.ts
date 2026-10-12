import type { Transform } from "jscodeshift";

/**
 * Renames the `action` prop to `onAction` on `Action`, and wraps a bare
 * function reference passed to it in an inline call.
 *
 * The scope is deliberately narrow. Only JSX elements that resolve to `Action`
 * — imported (named or as a namespace) from `@mittwald/flow-react-components`
 * or `@mittwald/flow-remote-react-components`, including their subpath entries
 * — are touched. `Action` is not one of the generated remote components, but
 * the remote package re-exports the `flr-universal` surface, which carries it.
 * Same-named components from other packages are left untouched, and so is the
 * `action` attribute of a plain `<form>`.
 *
 * An element that already carries `onAction` keeps it and only loses the stale
 * `action` prop, which mirrors what the runtime fallback does: an explicit
 * `onAction` wins.
 *
 * ## Why the wrap is unconditional
 *
 * `onAction` is typed `ActionFn` (`(...args: unknown[]) => unknown`), so a
 * reference to a function declaring a parameter of any narrower type — the
 * usual case being `controller.close`, typed `(options?: CloseOverlayOptions)
 * => void` — does not type-check. Whether a given reference declares such a
 * parameter needs type information and is not decidable from the source, which
 * is why this transform used to leave every reference alone and `apply` asked
 * for a manual pass over all of them.
 *
 * Deciding _whether_ to wrap needs the type. _Performing_ the wrap does not:
 * `() => fn()` calls exactly what `fn` would have been called with by `Action`,
 * minus the arguments — and `onAction` is documented as taking none. So the
 * wrap fixes the reference that needed it and is a no-op for the rest, which
 * makes the decision unnecessary.
 *
 * Two cases it can still change, neither decidable from the source:
 *
 * - A handler that reads the argument `Action` forwards (the trigger's event,
 *   e.g. a `PressEvent` from the `Button` inside) and declares it optional or
 *   as a rest parameter, so that it type-checks both before and after. It stops
 *   receiving that argument, silently. Nothing in Flow documents `onAction` as
 *   receiving one.
 * - A possibly-undefined reference, `onAction={props.onAction}`. `undefined` is a
 *   valid value for the prop, but calling it is not, so the wrap turns
 *   something TypeScript accepted into something it rejects — loudly, at the
 *   call site, which is why this is a compile error to fix rather than a
 *   regression to find.
 *
 * `apply` names both.
 *
 * Only a bare reference is wrapped: a plain identifier or a member expression.
 * An arrow function and a function expression already are the handler. A call
 * (`makeHandler()`, `close.bind(controller)`) _produces_ the handler, so
 * wrapping it would call the factory on every trigger and throw its result
 * away. A conditional, a `??` chain or an optional member expression is not a
 * reference to one function, so wrapping would be a guess.
 */
const actionPropToOnActionTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set(["Action"]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  /**
   * Whether a member expression is rooted in a plain reference —
   * `controller.close`, `this.handleSave`, `store.modal.controller.close` —
   * rather than in something evaluated, as `makeController().close` is.
   *
   * An optional link disqualifies the chain. `controller?.close` parses as
   * `OptionalMemberExpression` and never reaches here at all; walking the chain
   * catches a mixed one like `(a?.b).c`. Declining is deliberate: `() =>
   * controller?.close()` short-circuits differently from the value it would
   * replace, and the spelling says the reference may not be there.
   */
  const hasPlainObjectChain = (expression: { object?: unknown }): boolean => {
    const object = expression.object;
    if (!object || typeof object !== "object" || !("type" in object)) {
      return false;
    }
    const typed = object as { type: string; object?: unknown };
    return (
      typed.type === "ThisExpression" ||
      typed.type === "Identifier" ||
      (typed.type === "MemberExpression" && hasPlainObjectChain(typed))
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
    } else {
      for (const attribute of attributes) {
        if (isNamed(attribute, "action") && attribute.type === "JSXAttribute") {
          attribute.name.name = "onAction";
        }
      }
    }

    // Whatever the prop was called before, the surviving `onAction` is the one
    // that needs the wrap — including one the consumer had already renamed by
    // hand, which carries the same type error.
    for (const attribute of path.node.attributes ?? []) {
      if (
        attribute.type !== "JSXAttribute" ||
        !isNamed(attribute, "onAction")
      ) {
        continue;
      }

      const container = attribute.value;
      if (container?.type !== "JSXExpressionContainer") {
        continue;
      }

      // A bare reference is an identifier or a member expression. Everything
      // else either is the handler already or is a way of producing one.
      const expression = container.expression;
      if (
        expression.type !== "Identifier" &&
        expression.type !== "MemberExpression"
      ) {
        continue;
      }
      if (
        expression.type === "MemberExpression" &&
        !hasPlainObjectChain(expression)
      ) {
        continue;
      }

      attribute.value = j.jsxExpressionContainer(
        j.arrowFunctionExpression([], j.callExpression(expression, [])),
      );
    }
  });

  return root.toSource();
};

export default actionPropToOnActionTransform;
