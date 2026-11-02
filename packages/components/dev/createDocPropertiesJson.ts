import * as fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import ts from "typescript";

import type { ComponentDoc } from "react-docgen-typescript";
import { isConsumerProp, isInternalProp } from "./component-index/filterProps";
import {
  docPropertiesInternalFile,
  docPropertiesPublishedFile,
} from "./docProperties";
import { compilerOptionsOf, parseComponentDocs } from "./parseComponentDocs";

async function parse(): Promise<ComponentDoc[]> {
  console.log("📚 Building component docs");
  const files = await glob("./src/{components,integrations}/**/*.tsx", {
    ignore: [
      "src/**/*.stories.tsx",
      "src/**/*.test.tsx",
      "src/components/Icon/components/icons/**/*",
    ],
  });

  const program = ts.createProgram(
    files,
    compilerOptionsOf(path.resolve("./tsconfig.json")),
  );

  return parseComponentDocs(program, files);
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
 * them (see `docProperties.ts`). `callableReturn` is the generator's too.
 */
const forPublishing = (components: ComponentDoc[]): ComponentDoc[] =>
  components.map((component) => ({
    ...component,
    props: Object.fromEntries(
      Object.entries(component.props)
        .filter(
          ([name, prop]) =>
            name && prop && !isInternalProp(prop) && isConsumerProp(name, prop),
        )
        .map(([name, prop]) => {
          const { callableReturn: ignored, ...type } = prop.type;
          return [name, { ...prop, type }];
        }),
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
