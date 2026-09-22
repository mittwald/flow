import ts from "typescript";

/*
 * `@flr-generate` and `src/index/flr-universal.ts` are either-or, and nothing
 * else says so.
 *
 * `remote-react-components/src/index.ts` is `export * from "./auto-generated"`
 * plus `export * from "./components"`, and the latter re-exports
 * `@mittwald/flow-react-components/flr-universal`. A name both star exports
 * provide is ambiguous, and ESM resolves an ambiguous star export to nothing —
 * no error, no warning, not even at build time. The extension developer gets
 * `undefined`, React throws "Element type is invalid: expected a string … but
 * got: undefined", and every generated file for the component exists and is
 * correct, so the component's own code is the last place that is ever suspected.
 *
 * Generation is the only moment where both lists are in hand, so the collision
 * is decided here.
 */

/**
 * The names `flr-universal.ts` exports explicitly, values only — a type cannot
 * collide with a component at runtime, and an ambiguous type export is a
 * compile error rather than a silent `undefined`.
 *
 * `export * from` re-exports are out of scope: resolving them needs a full
 * program, and the curated list is where a component gets added by hand.
 */
export const readUniversalExportNames = (source: string): string[] => {
  const file = ts.createSourceFile(
    "flr-universal.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  const names: string[] = [];

  for (const statement of file.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) {
      continue;
    }
    const clause = statement.exportClause;
    if (!clause || !ts.isNamedExports(clause)) {
      continue;
    }
    for (const element of clause.elements) {
      if (!element.isTypeOnly) {
        names.push(element.name.text);
      }
    }
  }

  return names;
};

/** The names both surfaces provide, sorted, without duplicates. */
export const findUniversalExportOverlap = (
  generatedComponentNames: string[],
  universalExportNames: string[],
): string[] => {
  const universal = new Set(universalExportNames);
  return [
    ...new Set(generatedComponentNames.filter((name) => universal.has(name))),
  ].sort();
};

export const formatUniversalExportOverlapReport = (names: string[]): string =>
  [
    `⚠️  ${names.length} component${names.length === 1 ? " is" : "s are"} exported as both a generated remote component and a universal one:`,
    ...names.map((name) => `    ${name}`),
    "    The two are either-or, and a name both star exports of",
    "    remote-react-components provide resolves to `undefined` for the",
    "    extension developer — silently. Keep @flr-generate for a component the",
    "    host materializes from a flr-* element, and flr-universal.ts for one the",
    "    remote app renders itself; drop the other.",
  ].join("\n");
