import { getIconDefinitions, type IconVendor } from "./definitions";
import { fs } from "./fs";
import { prettify } from "./prettify";
import {
  getIconCategoriesFileContent,
  getIconFileContent,
  getIconSetFileContent,
  getIndexFileContent,
} from "./template";

const definitions = getIconDefinitions(`./icons.yaml`);

interface GenerateOptions {
  iconsOutputFolder: string;
  vendor: IconVendor;
  iconSetName: string;
}

export const generate = async (options: GenerateOptions) => {
  const { iconsOutputFolder, vendor, iconSetName } = options;

  const getIconFilename = (icon: string): string =>
    fs.path(iconsOutputFolder, `Icon${icon}.tsx`);

  const indexFilename = fs.path(iconsOutputFolder, "index.ts");
  const iconSetFilename = fs.path(iconsOutputFolder, "../iconSet.ts");
  const iconCategoriesFilename = fs.path(
    iconsOutputFolder,
    "../iconCategories.ts",
  );

  const filenames = Object.keys(definitions).map(getIconFilename);

  fs.find(iconsOutputFolder, {
    matching: "*.tsx",
  }).forEach((file) => {
    if (!filenames.includes(file)) {
      fs.remove(file);
    }
  });

  fs.remove(indexFilename);
  fs.remove(iconSetFilename);
  fs.remove(iconCategoriesFilename);

  for (const [iconName, iconDefinition] of Object.entries(definitions)) {
    const content = getIconFileContent(iconName, iconDefinition, vendor);
    fs.write(getIconFilename(iconName), await prettify(content));
  }

  fs.write(indexFilename, await prettify(getIndexFileContent(definitions)));

  fs.write(
    iconSetFilename,
    await prettify(getIconSetFileContent(iconSetName, definitions)),
  );

  fs.write(
    iconCategoriesFilename,
    await prettify(getIconCategoriesFileContent(definitions)),
  );
};
