import * as docgen from "react-docgen-typescript";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import { glob } from "glob";

import type { ComponentDoc } from "react-docgen-typescript";

async function parse(): Promise<ComponentDoc[]> {
  const parser = docgen.withCustomConfig("./tsconfig.json", {
    skipChildrenPropWithoutDoc: false,
    shouldRemoveUndefinedFromOptional: true,
    savePropValueAsString: true,
  });
  console.log("📚 Building component docs");
  const files = await glob("./src/components/*/*.tsx", {
    ignore: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
  });
  return parser.parse(files);
}

async function createDocPropertiesJson() {
  const components = await parse();

  console.log("📝 Writing output file");
  if (!fsSync.existsSync("./out/")) {
    await fs.mkdir("./out/");
  }
  await fs.writeFile(
    "./out/doc-properties.json",
    JSON.stringify(components, null, 2),
  );

  console.log("✅  Done");
}

void createDocPropertiesJson();
