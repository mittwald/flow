import { getIconNames } from "./names";
import { fs } from "./fs";
import { prettify } from "./prettify";
import { getIconFileContent, getIndexFileContent } from "./template";

const componentPath = "../../src/components/Icon";
const iconsOutputFolder = fs.path(`${componentPath}/components/icons`);

const getIconComponentFilename = (icon: string): string =>
  fs.path(`${componentPath}/components/icons/Icon${icon}.tsx`);

const getIndexFilename = (): string =>
  fs.path(`${componentPath}/components/icons/index.ts`);

const iconsYamlUrl = new URL(
  import.meta.resolve("@mittwald/flow-icons-base/icons.yaml"),
);
const iconNames = getIconNames(iconsYamlUrl.pathname);
const filenames = Object.keys(iconNames).map(getIconComponentFilename);

fs.find(iconsOutputFolder, {
  matching: "*.tsx",
}).forEach((file) => {
  if (!filenames.includes(file)) {
    fs.remove(file);
  }
});

for (const iconName of iconNames) {
  fs.write(
    getIconComponentFilename(iconName),
    await prettify(getIconFileContent(iconName)),
  );
}

fs.write(getIndexFilename(), await prettify(getIndexFileContent(iconNames)));
