import { prettify } from "./prettify";
import { fs, writeIfHasChanges } from "./fs";
import { getIconDefinitions } from "./definitions";
import { getIconFileContent, getIndexFileContent } from "./template";

const componentPath = "../../src/components/Icon";

const getIconComponentFilename = (icon: string): string =>
  fs.path(`${componentPath}/components/icons/Icon${icon}.tsx`);

const getIndexFilename = (): string =>
  fs.path(`${componentPath}/components/icons/index.ts`);

const definitions = getIconDefinitions(`${componentPath}/icons.yaml`);

for (const [iconName, iconDefinition] of Object.entries(definitions)) {
  writeIfHasChanges(
    getIconComponentFilename(iconName),
    await prettify(getIconFileContent(iconName, iconDefinition)),
  );
}

writeIfHasChanges(
  getIndexFilename(),
  await prettify(getIndexFileContent(definitions)),
);
