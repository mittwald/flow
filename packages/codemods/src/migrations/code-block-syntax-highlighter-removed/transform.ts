import type { Transform } from "jscodeshift";

/**
 * Drops the props `CodeBlock` lost when `react-syntax-highlighter` went
 * (alpha.756).
 *
 * All fifteen were re-exported straight from the highlighter's own props, and
 * none of them exists on the current component — so an explicit attribute is
 * wrong whatever its value is, the same reasoning `table-column-width-props`
 * applies to `maxWidth`. Removing one changes the rendering; that is the
 * migration, not a side effect. What survived is `code`, `copyable`,
 * `language`, `showLineNumbers`, `className` and `children`.
 *
 * `style` is in the set and looks alarming next to a DOM element, but on
 * `CodeBlock` it was never the DOM `style` — it was the highlighter's theme
 * object. There is no `style` prop now, so leaving it would be a type error.
 *
 * The scope is the same as its neighbours': only JSX elements that resolve to
 * `CodeBlock` — imported named, aliased, or through a namespace, from
 * `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries.
 *
 * Two things it does not do, both named in `apply`: a spread (`<CodeBlock
 * {...props} />`) can carry any of these invisibly, and `code` narrowed from
 * `string | string[]` to `string`, which needs a decision about the separator
 * rather than a rewrite.
 */
const codeBlockSyntaxHighlighterRemovedTransform: Transform = (
  fileInfo,
  { j },
) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set(["CodeBlock"]);
  const removedProps = new Set([
    "color",
    "style",
    "customStyle",
    "codeTagProps",
    "useInlineStyles",
    "showInlineLineNumbers",
    "startingLineNumber",
    "lineNumberContainerStyle",
    "lineNumberStyle",
    "wrapLines",
    "wrapLongLines",
    "lineProps",
    "renderer",
    "PreTag",
    "CodeTag",
  ]);

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
    const kept = attributes.filter(
      (attribute) =>
        attribute.type !== "JSXAttribute" ||
        attribute.name.type !== "JSXIdentifier" ||
        !removedProps.has(String(attribute.name.name)),
    );

    if (kept.length !== attributes.length) {
      path.node.attributes = kept;
      changed = true;
    }
  });

  // Returning the source untouched keeps this file out of the "changed" count.
  return changed ? root.toSource() : fileInfo.source;
};

export default codeBlockSyntaxHighlighterRemovedTransform;
