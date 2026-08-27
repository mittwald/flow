import * as fsSync from "fs";
import * as fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import * as docgen from "react-docgen-typescript";

import type { ComponentDoc } from "react-docgen-typescript";

/*
 * `shouldExtractLiteralValuesFromEnum` resolves the members behind a literal
 * union alias (`gap?: GapSize`), which `typeToString` would print as the bare
 * alias name. It reports them as `{ name: "enum", value: [...] }` — fold them
 * back into the union string every consumer reads from `type.name`.
 */
function expandLiteralUnions(components: ComponentDoc[]): void {
  for (const component of components) {
    for (const prop of Object.values(component.props)) {
      const { name, value } = prop.type;
      if (name === "enum" && Array.isArray(value) && value.length > 0) {
        prop.type.name = value
          .map((member: { value: unknown }) => String(member.value))
          .join(" | ");
      }
    }
  }
}

async function parse(): Promise<ComponentDoc[]> {
  const parser = docgen.withCustomConfig(path.resolve("./tsconfig.json"), {
    skipChildrenPropWithoutDoc: false,
    shouldRemoveUndefinedFromOptional: true,
    shouldExtractLiteralValuesFromEnum: true,
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

  const components = parser.parse(files);
  expandLiteralUnions(components);
  return components;
}

async function createDocPropertiesJson() {
  const components = await parse();
  const targetFile = "./dist/assets/doc-properties.json";

  console.log("📝 Writing output file " + path.resolve(targetFile));
  if (!fsSync.existsSync("./dist/")) {
    await fs.mkdir("./dist/");
  }
  if (!fsSync.existsSync("./dist/assets")) {
    await fs.mkdir("./dist/assets");
  }
  await fs.writeFile(
    "./dist/assets/doc-properties.json",
    JSON.stringify(components, null, 2),
  );

  console.log("✅  Done");
}

void createDocPropertiesJson();
