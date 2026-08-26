import type { Transform } from "jscodeshift";

/**
 * Renames `MutedActionError` to `AbortActionError`, along with its two static
 * helpers (alpha.712).
 *
 * ```diff
 * -throw new MutedActionError();
 * +throw new AbortActionError();
 * -MutedActionError.isMutedActionError(error);
 * +AbortActionError.isAbortActionError(error);
 * -MutedActionError.rethrowIfNotMuted(error);
 * +AbortActionError.rethrowIfNotAborted(error);
 * ```
 *
 * There is no alias for the old name, so a codebase still using it does not
 * compile.
 *
 * The thrown error's `name` changed too, so a `error.name ===
 * "MutedActionError"` comparison is rewritten as well — but only in a file that
 * imports the class, and only where the string is compared with `==`, `===`,
 * `!=` or `!==`. A check living in a file that never imports the class cannot
 * be recognised; grep for the string once when you are done.
 *
 * Only names imported from `@mittwald/flow-react-components` or
 * `@mittwald/flow-remote-react-components` (including their subpath entries)
 * are touched. A local alias (`import { MutedActionError as Muted }`) keeps its
 * alias — the static helpers on it are renamed all the same. Namespace usages
 * (`Flow.MutedActionError`) are rewritten too.
 */
const flowAlphaMutedActionErrorToAbortActionErrorTransform: Transform = (
  fileInfo,
  { j },
) => {
  const flowPackages = [
    "@mittwald/flow-react-components",
    "@mittwald/flow-remote-react-components",
  ];
  const oldName = "MutedActionError";
  const newName = "AbortActionError";
  const memberRenames = new Map([
    ["isMutedActionError", "isAbortActionError"],
    ["rethrowIfNotMuted", "rethrowIfNotAborted"],
  ]);

  const isFlowImport = (source: string): boolean =>
    flowPackages.some((pkg) => source === pkg || source.startsWith(`${pkg}/`));

  // ast-types models `importKind` on the declaration only, while babel also
  // puts it on the specifier — which is where a per-specifier `type X` lives.
  const isTypeOnly = (specifier: object): boolean =>
    (specifier as { importKind?: string }).importKind === "type";
  const makeValueImport = (specifier: object): void => {
    (specifier as { importKind?: string }).importKind = "value";
  };

  const root = j(fileInfo.source, { parser: "tsx" });

  /**
   * Local names bound to the class, alias or not — the static helpers hang off
   * these.
   */
  const classLocals = new Set<string>();
  /** Local names whose identifier itself has to be renamed (no alias in play). */
  const localRenames = new Set<string>();
  /** Local names of `import * as Flow` namespace imports from a Flow package. */
  const flowNamespaces = new Set<string>();

  const flowImports = root
    .find(j.ImportDeclaration)
    .filter((path) => isFlowImport(String(path.node.source.value)));

  /**
   * Local names the file already binds to the new name. Renaming onto one of
   * them must not add a second specifier, which would not parse.
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
        specifier.type === "ImportSpecifier" &&
        specifier.imported.type === "Identifier" &&
        specifier.imported.name === newName
      ) {
        claimed.add(String(specifier.local?.name ?? newName));
      }
    }
  });

  flowImports.forEach((path) => {
    const specifiers = path.node.specifiers ?? [];
    const survivors: typeof specifiers = [];

    for (const specifier of specifiers) {
      if (
        specifier.type !== "ImportSpecifier" ||
        specifier.imported.type !== "Identifier" ||
        specifier.imported.name !== oldName
      ) {
        survivors.push(specifier);
        continue;
      }

      const local = String(specifier.local?.name ?? oldName);
      const isAlias = local !== oldName;
      const newLocal = isAlias ? local : newName;

      classLocals.add(local);
      if (!isAlias) {
        localRenames.add(local);
      }

      if (claimed.has(newLocal)) {
        // The name is already bound by another import — drop this specifier
        // instead of declaring it twice.
        if (!isTypeOnly(specifier)) {
          for (const kept of survivors) {
            if (
              kept.type === "ImportSpecifier" &&
              kept.imported.type === "Identifier" &&
              String(kept.local?.name ?? kept.imported.name) === newLocal
            ) {
              makeValueImport(kept);
            }
          }
        }
        continue;
      }
      claimed.add(newLocal);

      // Mutate in place so an `import type` / `type X` modifier survives.
      specifier.imported.name = newName;
      if (!isAlias && specifier.local) {
        specifier.local.name = newName;
      }
      survivors.push(specifier);
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

  if (classLocals.size === 0 && flowNamespaces.size === 0) {
    return fileInfo.source;
  }

  /** Does this expression denote the class — `Muted` or `Flow.MutedActionError`? */
  const isClassReference = (
    node:
      | {
          type: string;
          name?: unknown;
          object?: { type: string; name?: unknown } | null;
          property?: { type: string; name?: unknown } | null;
        }
      | null
      | undefined,
  ): boolean => {
    if (!node) {
      return false;
    }
    if (node.type === "Identifier") {
      return classLocals.has(String(node.name));
    }
    return (
      node.type === "MemberExpression" &&
      node.object?.type === "Identifier" &&
      flowNamespaces.has(String(node.object.name)) &&
      node.property?.type === "Identifier" &&
      String(node.property.name) === oldName
    );
  };

  // Static helpers first: the check reads the pre-rename object name.
  root.find(j.MemberExpression).forEach((path) => {
    const { object, property } = path.node;
    if (property.type !== "Identifier" || !isClassReference(object)) {
      return;
    }

    const renamed = memberRenames.get(property.name);
    if (renamed) {
      property.name = renamed;
    }
  });

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
        path.node.name === oldName &&
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

  // `error.name === "MutedActionError"` — a comparison is the only place where
  // the string can be recognised as the error's name rather than free text.
  const comparisons = new Set(["===", "!==", "==", "!="]);
  root.find(j.BinaryExpression).forEach((path) => {
    if (!comparisons.has(path.node.operator)) {
      return;
    }

    for (const side of [path.node.left, path.node.right]) {
      if (
        (side.type === "StringLiteral" || side.type === "Literal") &&
        side.value === oldName
      ) {
        side.value = newName;
      }
    }
  });

  return root.toSource();
};

export default flowAlphaMutedActionErrorToAbortActionErrorTransform;
