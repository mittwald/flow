import fs from "node:fs";
import { globSync } from "glob";
import * as path from "node:path";
import * as acorn from "acorn";
import acornJsx from "acorn-jsx";
import { ImportDeclaration, Literal } from "acorn";

interface ImportDefinition {
  names: string[];
  source: Literal["value"];
}

// @todo remove duplicated code (./src/lib/generateImports)
export function extractRawImports(code: string): ImportDefinition[] {
  const JSXParser = acorn.Parser.extend(acornJsx());

  const tree = JSXParser.parse(code, {
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

export default function generateImportMappings(
  pattern: string,
  outputPath: string,
) {
  const imports = globSync(pattern).flatMap((path) =>
    extractRawImports(fs.readFileSync(path, { encoding: "utf-8" })),
  );

  let generatedFileContents = `
/* @eslint-ignore */
/* auto-generated file */
import { ImportMapping } from "@/lib/types";

export const componentsImports: ImportMapping = {
`;

  imports.forEach((definition) => {
    definition.names.forEach((name: string) => {
      generatedFileContents += `  "${name}:${definition.source}": () => import("${definition.source}"),\n`;
    });
  });

  generatedFileContents += "};";

  const outputDir = path.basename(path.dirname(outputPath));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(outputPath, generatedFileContents.trim());
}
