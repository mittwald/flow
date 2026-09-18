import * as fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import * as docgen from "react-docgen-typescript";

import type { ComponentDoc } from "react-docgen-typescript";
import { isConsumerProp, isInternalProp } from "./component-index/filterProps";
import {
  docPropertiesInternalFile,
  docPropertiesPublishedFile,
} from "./docProperties";

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

const relativeFilePaths = (components: ComponentDoc[]): ComponentDoc[] => {
  const packageRoot = path.resolve(".");

  return components.map((component) => ({
    ...component,
    filePath: path.isAbsolute(component.filePath)
      ? path.relative(packageRoot, component.filePath)
      : component.filePath,
  }));
};

/*
 * Extending a DOM element's props drags in the whole HTML/SVG attribute flood —
 * `Icon` alone inherits 486 of them. They are what the remote generator reads
 * and what no consumer can act on, which is why only the published file drops
 * them (see `docProperties.ts`).
 */
const forPublishing = (components: ComponentDoc[]): ComponentDoc[] =>
  components.map((component) => ({
    ...component,
    props: Object.fromEntries(
      Object.entries(component.props).filter(
        ([name, prop]) =>
          name && prop && !isInternalProp(prop) && isConsumerProp(name, prop),
      ),
    ),
  }));

async function write(
  targetFile: string,
  components: ComponentDoc[],
): Promise<void> {
  console.log("📝 Writing output file " + path.resolve(targetFile));
  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.writeFile(targetFile, JSON.stringify(components));
}

async function createDocPropertiesJson() {
  const components = relativeFilePaths(await parse());

  await write(docPropertiesInternalFile, components);
  await write(docPropertiesPublishedFile, forPublishing(components));

  console.log("✅  Done");
}

void createDocPropertiesJson();
