import type { Transform } from "jscodeshift";

/**
 * Renames the `defaultOpen` prop to `isDefaultOpen` on `Popover`,
 * `ContextualHelp` and `ContextMenu`.
 *
 * The scope is deliberately narrow, and here that is not only about same-named
 * components from other packages. `defaultOpen` is react-aria's own prop and
 * Flow passes it straight through on `Select`, `MenuTrigger`, `Tooltip`,
 * `TooltipTrigger`, `DialogTrigger`, `DatePicker` and `DateRangePicker`, where
 * it did not change — renaming it there would remove a working prop.
 *
 * Only JSX elements that resolve to one of the three — imported (named or as a
 * namespace) from `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components`, including their subpath entries —
 * are touched.
 *
 * An element that already carries `isDefaultOpen` keeps it and only loses the
 * stale `defaultOpen`, which mirrors the runtime: `isDefaultOpen` wins.
 *
 * The other two changes of this migration are not here. `isOpen` and
 * `onOpenChange` changed behaviour, not spelling: whether a given `isOpen` is
 * meant to control the popover, and whether an `onOpenChange` handler performed
 * or suppressed the close, is not decidable from the source. `apply` asks for
 * those by hand.
 */
const popoverOpenStatePropsTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const affectedComponents = new Set([
    "Popover",
    "ContextualHelp",
    "ContextMenu",
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

    const isNamed = (attribute: (typeof attributes)[number], key: string) =>
      attribute.type === "JSXAttribute" &&
      attribute.name.type === "JSXIdentifier" &&
      attribute.name.name === key;

    if (!attributes.some((attribute) => isNamed(attribute, "defaultOpen"))) {
      return;
    }

    changed = true;

    if (attributes.some((attribute) => isNamed(attribute, "isDefaultOpen"))) {
      path.node.attributes = attributes.filter(
        (attribute) => !isNamed(attribute, "defaultOpen"),
      );
      return;
    }

    for (const attribute of attributes) {
      if (
        isNamed(attribute, "defaultOpen") &&
        attribute.type === "JSXAttribute" &&
        attribute.name.type === "JSXIdentifier"
      ) {
        attribute.name.name = "isDefaultOpen";
      }
    }
  });

  return changed ? root.toSource() : fileInfo.source;
};

export default popoverOpenStatePropsTransform;
