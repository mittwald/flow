import fs from "node:fs";
import { sync } from "glob";
import * as acorn from "acorn";
import jsx from "acorn-jsx";
import * as path from "node:path";
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

export default function generateImportMappings() {
  const imports = sync("./src/app/**/_examples/*.tsx").flatMap((path) =>
    extractRawImports(fs.readFileSync(path, { encoding: "utf-8" })),
  );

  let generatedFileContents = `/* auto-generated file */\n\nexport const componentsImports: Record<string, any> = {\n`;

  imports.forEach((definition) => {
    definition.names.forEach((name) => {
      generatedFileContents += `    "${name}:${definition.source}": () => import("${definition.source}"),\n`;
    });
  });

  generatedFileContents += "};";

  const outputFile = "./src/lib/componentImports.ts";
  if (!fs.existsSync(path.resolve(outputFile, ".."))) {
    fs.mkdirSync(path.resolve(outputFile, ".."));
  }

  fs.writeFileSync(outputFile, generatedFileContents);
}
