import type { ImportDeclaration } from "acorn";
import { tsxParser } from "@/lib/tsxParser";

/**
 * Removes the import statements from an example's source. Examples keep their
 * imports on disk — they are what `extractEditorScope` builds the editor's
 * scope from — but the editor shows only the markup below them.
 */
export const stripImports = (code: string): string => {
  let body;

  try {
    body = tsxParser.parse(code, {
      ecmaVersion: 14,
      sourceType: "module",
    }).body;
  } catch {
    return code;
  }

  const imports = body.filter(
    (node): node is ImportDeclaration => node.type === "ImportDeclaration",
  );

  const stripped = imports.reduceRight(
    (code, declaration) =>
      code.slice(0, declaration.start) + code.slice(declaration.end),
    code,
  );

  return stripped.replaceAll(/\n{3,}/g, "\n\n").trim();
};
