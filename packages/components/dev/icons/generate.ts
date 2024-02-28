import { prettify } from "./prettify";
import { fs, writeIfHasChanges } from "./fs";
import { getIconMappings } from "./mapping";
import { getIconFileContent, getIndexFileContent } from "./template";

const componentPath = "../../src/components/Icon";

const getIconComponentFilename = (icon: string): string =>
  fs.path(`${componentPath}/components/icons/Icon${icon}.tsx`);

const getIndexFilename = (): string =>
  fs.path(`${componentPath}/components/icons/index.ts`);

const mappings = getIconMappings(`${componentPath}/tablerMappings.yaml`);

for (const [iconFlow, iconTabler] of Object.entries(mappings)) {
  writeIfHasChanges(
    getIconComponentFilename(iconFlow),
    await prettify(getIconFileContent(iconFlow, iconTabler)),
  );
}

writeIfHasChanges(
  getIndexFilename(),
  await prettify(getIndexFileContent(Object.keys(mappings))),
);
