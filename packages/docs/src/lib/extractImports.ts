import * as acorn from "acorn";
import jsx from "acorn-jsx";
import { ImportDeclaration, Literal } from "acorn";

interface ImportDefinition {
  names: string[];
  source: Literal["value"];
}

export function extractRawImports(moduleCode: string): ImportDefinition[] {
  const JSXParser = acorn.Parser.extend(jsx());

  const tree = JSXParser.parse(moduleCode, {
    ecmaVersion: 14,
    sourceType: "module",
  });

  const imports = tree.body.filter((node): node is ImportDeclaration => {
    return node.type === "ImportDeclaration";
  });

  return imports.map((declaration) => {
    return {
      names: declaration.specifiers.map((specifier) => specifier.local.name),
      source: declaration.source.value,
    };
  });
}
