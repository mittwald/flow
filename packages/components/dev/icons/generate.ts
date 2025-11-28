import { getIconDefinitions } from "./definitions";
import { fs } from "./fs";
import { prettify } from "./prettify";
import { getIconFileContent, getIndexFileContent } from "./template";

const componentPath = "../../src/components/Icon";
const iconsOutputFolder = fs.path(`${componentPath}/components/icons`);

const getIconComponentFilename = (icon: string): string =>
  fs.path(`${componentPath}/components/icons/Icon${icon}.tsx`);

const getIndexFilename = (): string =>
  fs.path(`${componentPath}/components/icons/index.ts`);

const definitions = getIconDefinitions(`${componentPath}/icons.yaml`);
const filenames = Object.keys(definitions).map(getIconComponentFilename);

fs.find(iconsOutputFolder, {
  matching: "*.tsx",
}).forEach((file) => {
  if (!filenames.includes(file)) {
    fs.remove(file);
  }
});

for (const [iconName, iconDefinition] of Object.entries(definitions)) {
  fs.write(
    getIconComponentFilename(iconName),
    await prettify(getIconFileContent(iconName, iconDefinition)),
  );
}

fs.write(getIndexFilename(), await prettify(getIndexFileContent(definitions)));
