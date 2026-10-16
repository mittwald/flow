import { getIconDefinitions, type IconVendor } from "./definitions";
import { fs } from "./fs";
import { prettify } from "./prettify";
import {
  getIconCategoriesFileContent,
  getIconFileContent,
  getIconSetFileContent,
  getIndexFileContent,
} from "./template";
import {
  getSvelteIconFileContent,
  getSvelteIconIndexFileContent,
  getSvelteIconNamesFileContent,
} from "./svelteTemplate";

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

interface GenerateSvelteOptions {
  /** Absolute path of the folder the `.svelte` icons are written to. */
  iconsOutputFolder: string;
}

/**
 * The Svelte icon set. Its own entry point rather than a flag on `generate`,
 * because almost nothing is shared: no icon set registry, no categories, and
 * markup instead of JSX.
 */
export const generateSvelte = async (options: GenerateSvelteOptions) => {
  const { iconsOutputFolder } = options;

  const getIconFilename = (icon: string): string =>
    fs.path(iconsOutputFolder, `Icon${icon}.svelte`);

  const indexFilename = fs.path(iconsOutputFolder, "index.ts");
  const filenames = Object.keys(definitions).map(getIconFilename);

  fs.find(iconsOutputFolder, { matching: "*.svelte" }).forEach((file) => {
    if (!filenames.includes(file)) {
      fs.remove(file);
    }
  });

  fs.remove(indexFilename);

  for (const [iconName, iconDefinition] of Object.entries(definitions)) {
    /*
     * Written unformatted: the repository's prettier run covers `.ts`/`.tsx`,
     * not `.svelte`, so there is nothing that would format it afterwards — and
     * the markup has to stay free of whitespace between nodes anyway.
     */
    fs.write(
      getIconFilename(iconName),
      getSvelteIconFileContent(iconName, iconDefinition),
    );
  }

  fs.write(
    indexFilename,
    await prettify(getSvelteIconIndexFileContent(definitions)),
  );

  fs.write(
    fs.path(iconsOutputFolder, "iconNames.ts"),
    await prettify(getSvelteIconNamesFileContent(definitions)),
  );
};
