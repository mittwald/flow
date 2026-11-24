import ts from "typescript";

/**
 * Reads the `type` option of the `flowComponent(name, …, { type })` call in a
 * component's source. The generated remote component has to be created with the
 * same type: `flowComponent` defaults to `"ui"`, which clears every props
 * context around it, so a remote `"layout"` or `"provider"` component would cut
 * the contexts a remote composition (`Modal`, `List`, …) sets.
 *
 * Returns `undefined` when the source has no such call or the call sets no
 * type. Throws when the type is set but not as a string literal — the generator
 * cannot read it then, and guessing would silently pick `"ui"`.
 */
export const provisionTypeOf = (
  source: string,
  componentName: string,
): string | undefined => {
  const file = ts.createSourceFile(
    "component.tsx",
    source,
    ts.ScriptTarget.Latest,
  );
  let result: string | undefined;

  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "flowComponent"
    ) {
      const [nameArg, , optionsArg] = node.arguments;
      if (
        nameArg &&
        ts.isStringLiteralLike(nameArg) &&
        nameArg.text === componentName
      ) {
        result = typeOptionOf(optionsArg, componentName);
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);

  return result;
};

const typeOptionOf = (
  options: ts.Expression | undefined,
  componentName: string,
) => {
  if (!options) {
    return undefined;
  }

  const fail = () => {
    throw new Error(
      `Could not read the flowComponent type of ${componentName}: pass the options as an object literal with a string literal \`type\`.`,
    );
  };

  if (!ts.isObjectLiteralExpression(options)) {
    return fail();
  }

  const typeProperty = options.properties.find(
    (p) => p.name && ts.isIdentifier(p.name) && p.name.text === "type",
  );
  if (!typeProperty) {
    return undefined;
  }
  if (
    !ts.isPropertyAssignment(typeProperty) ||
    !ts.isStringLiteralLike(typeProperty.initializer)
  ) {
    return fail();
  }
  return typeProperty.initializer.text;
};
