import type { Transform } from "jscodeshift";

/**
 * Replaces `AsyncRule` and `SyncRule` with `Rule` (alpha.802).
 *
 * `@mittwald/password-tools-js` merged both classes into a single abstract
 * `Rule`, and the `mittwald-password-tools-js` entry stopped re-exporting the
 * old names. A custom rule extends `Rule` and may return its result
 * synchronously or as a promise — the distinction the two classes encoded is
 * gone, so both names collapse onto the same one.
 *
 * Only names imported from the `mittwald-password-tools-js` entry of
 * `@mittwald/flow-react-components` are touched, so a same-named import from
 * another package is left alone. `@mittwald/flow-remote-react-components` has
 * no such entry. A name imported under a local alias (`import { AsyncRule as
 * Base }`) keeps its alias — only the imported name changes. Namespace usages
 * (`Pw.AsyncRule`) are rewritten as well.
 *
 * Because both names collapse onto `Rule`, a file importing more than one of
 * them would end up with a duplicate specifier. Those collapse onto one.
 */
const flowAlphaPasswordToolsRuleTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = [
    "@mittwald/flow-react-components/mittwald-password-tools-js",
  ];
  const renames = new Map([
    ["AsyncRule", "Rule"],
    ["SyncRule", "Rule"],
  ]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.includes(source);

  // ast-types models `importKind` on the declaration only, while babel also
  // puts it on the specifier — which is where a per-specifier `type X` lives.
  const isTypeOnly = (specifier: object): boolean =>
    (specifier as { importKind?: string }).importKind === "type";
  const makeValueImport = (specifier: object): void => {
    (specifier as { importKind?: string }).importKind = "value";
  };

  const root = j(fileInfo.source, { parser: "tsx" });

  /** Local identifiers that refer to a renamed export, mapped to the new name. */
  const localRenames = new Map<string, string>();
  /**
   * Whether any import specifier was rewritten. An aliased `Align as Row` adds
   * nothing to `localRenames` — its local name stays `Row` — so counting those
   * alone would treat an alias-only file as untouched and discard the rewrite.
   */
  let renamedAnImport = false;
  /** Local names of `import * as Flow` namespace imports from a Flow package. */
  const flowNamespaces = new Set<string>();

  const flowImports = root
    .find(j.ImportDeclaration)
    .filter((path) => isFlowImport(String(path.node.source.value)));

  /**
   * `imported:local` pairs the file already binds without a rename. A rename
   * that lands on one of these must not add a second specifier for it — the
   * name is available from the import that already carries it, which is also
   * the entry that really exports it.
   */
  const claimed = new Set<string>();

  flowImports.forEach((path) => {
    for (const specifier of path.node.specifiers ?? []) {
      if (
        specifier.type === "ImportNamespaceSpecifier" &&
        specifier.local?.name
      ) {
        flowNamespaces.add(String(specifier.local.name));
        continue;
      }

      if (
        specifier.type !== "ImportSpecifier" ||
        specifier.imported.type !== "Identifier" ||
        renames.has(specifier.imported.name)
      ) {
        continue;
      }

      claimed.add(
        `${specifier.imported.name}:${String(
          specifier.local?.name ?? specifier.imported.name,
        )}`,
      );
    }
  });

  flowImports.forEach((path) => {
    const specifiers = path.node.specifiers ?? [];
    const survivors: typeof specifiers = [];

    for (const specifier of specifiers) {
      if (
        specifier.type !== "ImportSpecifier" ||
        specifier.imported.type !== "Identifier"
      ) {
        survivors.push(specifier);
        continue;
      }

      const imported = specifier.imported.name;
      const renamed = renames.get(imported);
      if (!renamed) {
        survivors.push(specifier);
        continue;
      }

      const local = String(specifier.local?.name ?? imported);
      const isAlias = local !== imported;
      const newLocal = isAlias ? local : renamed;
      const key = `${renamed}:${newLocal}`;

      renamedAnImport = true;
      if (!isAlias) {
        // An aliased import keeps its local name and needs no further change.
        localRenames.set(local, renamed);
      }

      // Renaming can collide with a name the file already binds — directly, or
      // because a second old name maps onto the same new one. Either way the
      // binding already exists, so this specifier goes away instead of
      // producing a duplicate declaration, which would not parse.
      const collision = claimed.has(key);
      claimed.add(key);
      if (collision) {
        // A value import must not lose out to a type-only one.
        if (!isTypeOnly(specifier)) {
          for (const kept of survivors) {
            if (
              kept.type === "ImportSpecifier" &&
              kept.imported.type === "Identifier" &&
              `${kept.imported.name}:${String(
                kept.local?.name ?? kept.imported.name,
              )}` === key
            ) {
              makeValueImport(kept);
            }
          }
        }
        continue;
      }

      // Mutate in place so an `import type` / `type X` modifier survives.
      specifier.imported.name = renamed;
      if (!isAlias && specifier.local) {
        specifier.local.name = renamed;
      }
      survivors.push(specifier);
    }

    if (survivors.length === specifiers.length) {
      return;
    }

    // Every specifier moved to an import that already binds the name. Leaving
    // the declaration behind would turn it into a side-effect import of an
    // entry the file no longer uses.
    if (survivors.length === 0) {
      j(path).remove();
      return;
    }

    path.node.specifiers = survivors;
  });

  if (!renamedAnImport && flowNamespaces.size === 0) {
    return fileInfo.source;
  }

  /**
   * `JSXIdentifier` extends `Identifier`, so this one pass covers JSX tags,
   * value references and type references alike. Positions where the name is not
   * a reference to the import — an object key, a member's property, a JSX
   * attribute name — are skipped.
   */
  root.find(j.Identifier).forEach((path) => {
    const parent = path.parent.node;

    const isNamespaceMember =
      (parent.type === "MemberExpression" ||
        parent.type === "JSXMemberExpression") &&
      parent.property === path.node;

    if (isNamespaceMember) {
      const object = parent.object;
      if (object.type === "Identifier" || object.type === "JSXIdentifier") {
        const renamed = renames.get(path.node.name);
        if (renamed && flowNamespaces.has(String(object.name))) {
          path.node.name = renamed;
        }
      }
      return;
    }

    if (
      parent.type === "ImportSpecifier" ||
      parent.type === "JSXAttribute" ||
      ((parent.type === "ObjectProperty" || parent.type === "Property") &&
        parent.key === path.node &&
        !parent.computed)
    ) {
      return;
    }

    const renamed = localRenames.get(path.node.name);
    if (renamed) {
      path.node.name = renamed;
    }
  });

  return root.toSource();
};

export default flowAlphaPasswordToolsRuleTransform;
