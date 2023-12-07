import * as babelParser from "@babel/parser";
import { ImportDeclaration, StringLiteral } from "@babel/types";

interface ImportDefinition {
  names: string[];
  source: StringLiteral["value"];
}

export function extractRawImports(moduleCode: string): ImportDefinition[] {
  const tree = babelParser.parse(moduleCode, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const imports = tree.program.body.filter(
    (node): node is ImportDeclaration => {
      return node.type === "ImportDeclaration";
    },
  );

  return imports.map((declaration) => {
    return {
      names: declaration.specifiers.map((specifier) => specifier.local.name),
      source: declaration.source.value,
    };
  });
}
