import fsAsync from "fs/promises";
import fs from "fs";
import { glob } from "glob";
import * as path from "path";
import type { Literal } from "acorn";
import { extractRawImports } from "../src/lib/liveCode/extractImports.js";
import { sortBy } from "remeda";

void generateImportMappings(
  "./src/content/**/examples/*.tsx",
  "./src/lib/liveCode/dynamicImports.ts",
);

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

function getNamedExport(name: string): string {
  return name.split(":")[0] ?? name;
}

async function generateImportMappings(pattern: string, outputPath: string) {
  console.log("Generating imports from files");
  const matchedFiles = sortBy(await glob(pattern), (s) => s);

  console.log(` - ${matchedFiles.join("\r\n - ")}`);

  const fileContents = await Promise.all(
    matchedFiles.flatMap((path) =>
      fsAsync.readFile(path, { encoding: "utf-8" }),
    ),
  );

  const imports = mapImports(fileContents.flatMap(extractRawImports));

  const staticImports = Object.entries(imports).map(([name, source], index) => {
    const namedExport = getNamedExport(name);
    return `import { ${namedExport} as I${index} } from "${source}";`;
  });

  const mappings = Object.entries(imports).map(([name], index) => {
    return `"${name}": I${index},`;
  });

  const generatedFileContents = `
/* eslint-disable */
/* auto-generated file */
import type { ImportMapping } from "@/lib/liveCode/types";
import { lazy } from "react";
${staticImports.filter((i) => i !== undefined).join("\r\n")}

export const liveCodeEditorGlobalImports: ImportMapping = {
  ${mappings.join("\r\n")}
};
`;

  const outputDir = path.basename(path.dirname(outputPath));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(outputPath, generatedFileContents.trim());
}
