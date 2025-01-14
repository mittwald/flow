import type { ImportDeclaration, Literal } from "acorn";
import { tsxParser } from "~/lib/tsxParser";

interface ImportDefinition {
  names: string[];
  source: Literal["value"];
}

function isTypeImport(something: unknown): something is { importKind: "type" } {
  return (
    !!something &&
    typeof something === "object" &&
    "importKind" in something &&
    something.importKind === "type"
  );
}

export function extractRawImports(moduleCode: string): ImportDefinition[] {
  const tree = tsxParser.parse(moduleCode, {
    ecmaVersion: 14,
    sourceType: "module",
  });

  const imports = tree.body.filter((node): node is ImportDeclaration => {
    return node.type === "ImportDeclaration";
  });

  return imports.map((declaration) => {
    return {
      names: declaration.specifiers
        .filter((s) => !isTypeImport(s))
        .map((specifier) => specifier.local.name),
      source: declaration.source.value,
    };
  });
}
