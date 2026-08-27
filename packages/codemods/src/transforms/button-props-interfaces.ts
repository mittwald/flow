import type { Transform } from "jscodeshift";

/**
 * Replaces the removed `Button` props interfaces with `ButtonProps`
 * (alpha.646).
 *
 * `RemoteButtonElementProps`, `ResetButtonProps` and `SubmitButtonProps` were
 * removed; all three are `ButtonProps`. There is no alias for the old names, so
 * a codebase still using them does not compile.
 *
 * This is more than a rename, because the names do not share an entry.
 * `SubmitButtonProps` and `ResetButtonProps` came from the `react-hook-form`
 * entry, which does not export `ButtonProps` — renaming them in place would
 * swap one import error for another. The specifier therefore moves to the
 * package root of whichever Flow package it came from, joining an existing
 * import from that root or getting a new one.
 *
 * The scope is `@mittwald/flow-react-components` and its subpath entries only.
 * The remote package re-exports the `flr-universal` surface, so it does carry
 * some prop types — `ActionProps`, `ModalProps` and the like — but
 * `ButtonProps` is not among them. There is nothing to move a remote import
 * onto, so a remote codebase has to pick its own source for the type.
 * `RemoteButtonElementProps` is left alone for the same reason, and because
 * `@mittwald/flow-remote-elements` still exports that name today.
 *
 * A same-named import from another package is left alone. A name imported under
 * a local alias (`import { SubmitButtonProps as P }`) keeps its alias — it
 * becomes `ButtonProps as P`. Namespace usages (`Flow.SubmitButtonProps`) are
 * rewritten as well.
 *
 * All three collapse onto `ButtonProps`, so a file importing more than one of
 * them — or one of them next to `ButtonProps` itself — ends up with a single
 * specifier instead of a duplicate declaration, which would not parse.
 */
const buttonPropsInterfacesTransform: Transform = (fileInfo, { j }) => {
  const flowPackages = ["@mittwald/flow-react-components"];
  const removed = new Set(["ResetButtonProps", "SubmitButtonProps"]);
  const newName = "ButtonProps";

  /** The Flow package a module specifier belongs to, or `undefined`. */
  const rootPackageOf = (source: string): string | undefined =>
    flowPackages.find((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  // ast-types models `importKind` on the declaration only, while babel also
  // puts it on the specifier — which is where a per-specifier `type X` lives.
  const isTypeOnly = (node: object): boolean =>
    (node as { importKind?: string }).importKind === "type";

  const root = j(fileInfo.source, { parser: "tsx" });

  /** Local identifiers that have to be renamed (no alias in play). */
  const localRenames = new Set<string>();
  /** Local names of `import * as Flow` namespace imports from a Flow package. */
  const flowNamespaces = new Set<string>();
  /** `package:local` pairs that already import `ButtonProps` from a root. */
  const bound = new Set<string>();
  /** `package:local` pairs that still need importing, and whether type-only. */
  const wanted = new Map<
    string,
    { pkg: string; local: string; type: boolean }
  >();

  const flowImports = root
    .find(j.ImportDeclaration)
    .filter((path) => !!rootPackageOf(String(path.node.source.value)));

  flowImports.forEach((path) => {
    const source = String(path.node.source.value);
    for (const specifier of path.node.specifiers ?? []) {
      if (
        specifier.type === "ImportNamespaceSpecifier" &&
        specifier.local?.name
      ) {
        flowNamespaces.add(String(specifier.local.name));
        continue;
      }

      if (
        specifier.type === "ImportSpecifier" &&
        specifier.imported.type === "Identifier" &&
        specifier.imported.name === newName &&
        source === rootPackageOf(source)
      ) {
        bound.add(`${source}:${String(specifier.local?.name ?? newName)}`);
      }
    }
  });

  flowImports.forEach((path) => {
    const source = String(path.node.source.value);
    const pkg = rootPackageOf(source) ?? source;
    const declarationIsType = isTypeOnly(path.node);
    const specifiers = path.node.specifiers ?? [];
    const survivors: typeof specifiers = [];

    for (const specifier of specifiers) {
      if (
        specifier.type !== "ImportSpecifier" ||
        specifier.imported.type !== "Identifier" ||
        !removed.has(specifier.imported.name)
      ) {
        survivors.push(specifier);
        continue;
      }

      const imported = specifier.imported.name;
      const local = String(specifier.local?.name ?? imported);
      const isAlias = local !== imported;
      const newLocal = isAlias ? local : newName;
      const key = `${pkg}:${newLocal}`;

      if (!isAlias) {
        localRenames.add(local);
      }

      if (!bound.has(key)) {
        const existing = wanted.get(key);
        const type = declarationIsType || isTypeOnly(specifier);
        wanted.set(key, {
          pkg,
          local: newLocal,
          // A value import must not lose out to a type-only one.
          type: existing ? existing.type && type : type,
        });
      }
    }

    if (survivors.length === specifiers.length) {
      return;
    }

    // Leaving an emptied declaration behind would turn it into a side-effect
    // import of an entry the file no longer uses.
    if (survivors.length === 0) {
      j(path).remove();
      return;
    }

    path.node.specifiers = survivors;
  });

  if (
    wanted.size === 0 &&
    localRenames.size === 0 &&
    flowNamespaces.size === 0
  ) {
    return fileInfo.source;
  }

  for (const { pkg, local, type } of wanted.values()) {
    const specifier = j.importSpecifier(
      j.identifier(newName),
      j.identifier(local),
    );

    // Join an import from the package root when the file already has one and
    // it can carry the specifier; otherwise add a declaration of its own.
    const host = root
      .find(j.ImportDeclaration)
      .filter(
        (path) =>
          String(path.node.source.value) === pkg &&
          isTypeOnly(path.node) === type,
      )
      .paths()[0];

    if (host) {
      host.node.specifiers = [...(host.node.specifiers ?? []), specifier];
      continue;
    }

    const declaration = j.importDeclaration([specifier], j.literal(pkg));
    if (type) {
      declaration.importKind = "type";
    }

    const firstImport = root.find(j.ImportDeclaration).paths()[0];
    if (firstImport) {
      j(firstImport).insertBefore(declaration);
    } else {
      root.get().node.program.body.unshift(declaration);
    }
  }

  /**
   * `JSXIdentifier` extends `Identifier`, so this one pass covers value
   * references and type references alike. Positions where the name is not a
   * reference to the import — an object key, a member's property, a JSX
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
      if (
        (object.type === "Identifier" || object.type === "JSXIdentifier") &&
        removed.has(path.node.name) &&
        flowNamespaces.has(String(object.name))
      ) {
        path.node.name = newName;
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

    if (localRenames.has(path.node.name)) {
      path.node.name = newName;
    }
  });

  return root.toSource();
};

export default buttonPropsInterfacesTransform;
