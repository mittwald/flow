import * as fsSync from "fs";
import * as fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import * as docgen from "react-docgen-typescript";

import type { ComponentDoc } from "react-docgen-typescript";

async function parse(): Promise<ComponentDoc[]> {
  const parser = docgen.withCustomConfig(path.resolve("./tsconfig.json"), {
    skipChildrenPropWithoutDoc: false,
    shouldRemoveUndefinedFromOptional: true,
    savePropValueAsString: true,
  });

  console.log("📚 Building component docs");
  const files = await glob("./src/{components,integrations}/**/*.tsx", {
    ignore: [
      "src/**/*.stories.tsx",
      "src/**/*.test.tsx",
      "src/components/Icon/components/icons/**/*",
    ],
  });

  return parser.parse(files);
}

const relativeFilePaths = (components: ComponentDoc[]): ComponentDoc[] => {
  const packageRoot = path.resolve(".");

  return components.map((component) => ({
    ...component,
    filePath: path.isAbsolute(component.filePath)
      ? path.relative(packageRoot, component.filePath)
      : component.filePath,
  }));
};

async function createDocPropertiesJson() {
  const components = relativeFilePaths(await parse());
  const targetFile = "./dist/assets/doc-properties.json";

  console.log("📝 Writing output file " + path.resolve(targetFile));
  if (!fsSync.existsSync("./dist/")) {
    await fs.mkdir("./dist/");
  }
  if (!fsSync.existsSync("./dist/assets")) {
    await fs.mkdir("./dist/assets");
  }
  await fs.writeFile(targetFile, JSON.stringify(components));

  console.log("✅  Done");
}

void createDocPropertiesJson();
