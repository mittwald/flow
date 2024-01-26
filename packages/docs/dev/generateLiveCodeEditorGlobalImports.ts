import fsAsync from "node:fs/promises";
import fs from "node:fs";
import { glob } from "glob";
import * as path from "node:path";
import { Literal } from "acorn";
import { extractRawImports } from "../src/lib/LiveCodeEditor/extractImports.js";

interface ImportDefinition {
  names: string[];
  source: Literal["value"];
}

function mapImports(imports: ImportDefinition[]): Record<string, string> {
  return Object.fromEntries(
    imports.flatMap((i) =>
      i.names.map((name) => [`${name}:${i.source}`, String(i.source)]),
    ),
  );
}

async function generateImportMappings(pattern: string, outputPath: string) {
  console.log("Generating imports from files");
  const matchedFiles = await glob(pattern);

  console.log(` - ${matchedFiles.join("\r\n - ")}`);

  const fileContents = await Promise.all(
    matchedFiles.flatMap((path) =>
      fsAsync.readFile(path, { encoding: "utf-8" }),
    ),
  );

  const imports = mapImports(fileContents.flatMap(extractRawImports));

  const importStatements = Object.entries(imports).map(
    ([key, value]) => `"${key}": () => import("${value}"),`,
  );

  const generatedFileContents = `
/* eslint-disable */
/* auto-generated file */
import { ImportMapping } from "@/lib/LiveCodeEditor/types";

export const liveCodeEditorGlobalImports: ImportMapping = {
  ${importStatements.join("\r\n")}
};
`;

  const outputDir = path.basename(path.dirname(outputPath));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(outputPath, generatedFileContents.trim());
}

void generateImportMappings(
  "./src/docs/**/examples/*.tsx",
  "./src/lib/liveCodeEditorGlobalImports.ts",
);
