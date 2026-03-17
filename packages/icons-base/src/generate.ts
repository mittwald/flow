import { getIconDefinitions, type IconVendor } from "./definitions";
import { fs } from "./fs";
import { prettify } from "./prettify";
import {
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

  const filenames = Object.keys(definitions).map(getIconFilename);

  fs.find(iconsOutputFolder, {
    matching: "*.tsx",
  }).forEach((file) => {
    if (!filenames.includes(file)) {
      fs.remove(file);
    }
  });

  for (const [iconName, iconDefinition] of Object.entries(definitions)) {
    const content = getIconFileContent(iconName, iconDefinition, vendor);
    fs.write(getIconFilename(iconName), await prettify(content));
  }

  fs.write(
    fs.path(iconsOutputFolder, "index.ts"),
    await prettify(getIndexFileContent(definitions)),
  );

  fs.write(
    fs.path(iconsOutputFolder, "../iconSet.ts"),
    await prettify(getIconSetFileContent(iconSetName, definitions)),
  );
};
