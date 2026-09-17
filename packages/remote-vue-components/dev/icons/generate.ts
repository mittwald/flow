/**
 * Generates the Vue icon components from the shared icon sources.
 *
 * The React packages generate components straight out of `icons.yaml`; a Vue
 * app cannot import those, so this reads the same icons as data
 * (`getIconSources`) and writes Vue components from it. The path data is
 * inlined for the same reason as in `@mittwald/flow-icons`: consumers should
 * not have to install `@tabler/icons-react` (74 MB, ~24,000 files).
 */
import {
  getIconSources,
  prettify,
  type SvgNode,
} from "@mittwald/flow-icons-base";
import { readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outputFolder = path.resolve(here, "../../src/icons/components");

const tablerNotice =
  "/* Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. See LICENSE. */";

const svgNodeLiteral = (node: SvgNode): string =>
  `{ tag: ${JSON.stringify(node.tag)}, attributes: ${JSON.stringify(node.attributes)}, children: [${node.children.map(svgNodeLiteral).join(", ")}] }`;

const sources = getIconSources();

const fileContentFor = (iconName: string): string => {
  const source = sources[iconName];

  if (source?.kind === "tabler") {
    return `\
      ${tablerNotice}
      import { tablerIcon } from "../lib/createIcon";

      export const Icon${iconName} = tablerIcon(
        ${JSON.stringify(iconName)},
        ${JSON.stringify(source.type)},
        ${JSON.stringify(source.name)},
        ${JSON.stringify(source.node)},
      );

      export default Icon${iconName};
    `;
  }

  if (source?.kind === "svg") {
    return `\
      import { svgIcon } from "../lib/createIcon";

      export const Icon${iconName} = svgIcon(
        ${JSON.stringify(iconName)},
        ${svgNodeLiteral(source.root)},
      );

      export default Icon${iconName};
    `;
  }

  throw new Error(`No source for icon "${iconName}".`);
};

const iconNames = Object.keys(sources);
const fileNameFor = (iconName: string): string => `Icon${iconName}.ts`;
const expected = new Set([...iconNames.map(fileNameFor), "index.ts"]);

/* A removed icon leaves a file behind, and the index would stop exporting it
 * while the file kept compiling — so the folder is swept, not just written to. */
for (const file of readdirSync(outputFolder)) {
  if (!expected.has(file)) {
    rmSync(path.join(outputFolder, file));
  }
}

for (const iconName of iconNames) {
  writeFileSync(
    path.join(outputFolder, fileNameFor(iconName)),
    await prettify(fileContentFor(iconName)),
    "utf8",
  );
}

writeFileSync(
  path.join(outputFolder, "index.ts"),
  await prettify(
    iconNames
      .map((icon) => `export { Icon${icon} } from "./Icon${icon}";\n`)
      .join(""),
  ),
  "utf8",
);
