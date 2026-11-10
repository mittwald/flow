import fs from "node:fs";
import yaml from "js-yaml";
import StyleDictionary from "style-dictionary";
import {
  fileHeader,
  formattedVariables,
  getReferences,
  usesReferences,
} from "style-dictionary/utils";
import { propertyFormatNames } from "style-dictionary/enums";

StyleDictionary.registerParser({
  pattern: /\.yml$/,
  name: "yml-parser",
  parser: ({ contents }) => yaml.load(contents),
});

StyleDictionary.registerTransform({
  type: "name",
  name: "name/flow-css-var",
  transform: (token, options) => {
    return [options.prefix]
      .concat(token.path)
      .filter((p) => !!p)
      .join("--");
  },
});

/*
 * The `json` format's build metadata (`filePath`, `isSource`, `original`, …)
 * dwarfs the values and means nothing in a browser, so runtime consumers
 * (`useDesignTokens`) import this tree instead: same shape, only `value` and
 * `path`.
 */
StyleDictionary.registerFormat({
  name: "json/flow-runtime",
  format: ({ dictionary }) => {
    const tree = {};

    for (const token of dictionary.allTokens) {
      const groups = token.path.slice(0, -1);
      const name = token.path.at(-1);
      let node = tree;

      for (const group of groups) {
        node[group] ??= {};
        node = node[group];
      }

      node[name] = { value: token.value, path: token.path };
    }

    return `${JSON.stringify(tree, null, 2)}\n`;
  },
});

/*
 * CSS variables, optionally inside `@layer flow.tokens`. `scopedSelector` adds
 * a second block for the tokens that reference themed tokens: every
 * `[data-theme]` element declares them again to resolve them against its own
 * theme (see `scopedTokenKeys`).
 */
const cssVariablesFormat =
  (layered) =>
  async ({ dictionary, options = {}, file }) => {
    const { selector = ":root", scopedSelector, formatting, ...rest } = options;
    const indentation = formatting?.indentation ?? "  ";
    const outerIndentation = layered ? indentation : "";
    const header = await fileHeader({ file, formatting, options });

    const block = (blockSelector, allTokens) => {
      const variables = formattedVariables({
        format: propertyFormatNames.css,
        dictionary: { ...dictionary, allTokens },
        outputReferences: rest.outputReferences,
        outputReferenceFallbacks: rest.outputReferenceFallbacks,
        usesDtcg: rest.usesDtcg,
        sort: rest.sort,
        formatting: {
          ...formatting,
          indentation: outerIndentation + indentation,
        },
      });
      return `${outerIndentation}${blockSelector} {\n${variables}\n${outerIndentation}}`;
    };

    const scopedKeys = scopedSelector ? scopedTokenKeys(dictionary) : new Set();
    const scoped = dictionary.allTokens.filter((token) =>
      scopedKeys.has(tokenKey(token)),
    );
    const unscoped = dictionary.allTokens.filter(
      (token) => !scoped.includes(token),
    );
    const blocks = [
      block(selector, unscoped),
      ...(scoped.length > 0 ? [block(scopedSelector, scoped)] : []),
    ].join("\n\n");

    return layered
      ? `${header}@layer flow.tokens {\n${blocks}\n}\n`
      : `${header}${blocks}\n`;
  };

StyleDictionary.registerFormat({
  name: "css/variables-flow",
  format: cssVariablesFormat(false),
});

StyleDictionary.registerFormat({
  name: "css/variables-layered",
  format: cssVariablesFormat(true),
});

const htmlAttribute = "data-theme";

// Categories with a light and a dark value; they go to the `colors-*` files.
const themedCategories = ["color", "texture"];
const isThemed = (token) => themedCategories.includes(token.path[0]);
const tokenKey = (token) => token.path.join(".");

/*
 * Tokens that reference a themed token, directly or through other tokens. A
 * custom property resolves its `var()` where it is declared and inherits the
 * result, so declared on `:root` only, they would keep the root theme inside a
 * `[data-theme]` section. `base` declares them on every `[data-theme]` element
 * as well. Their values are the same in both themes, so one block suffices.
 */
const scopedTokenKeys = (dictionary) => {
  const references = dictionary.unfilteredAllTokens
    .filter((token) => !isThemed(token) && usesReferences(token.original.value))
    .map((token) => ({
      key: tokenKey(token),
      references: getReferences(
        token.original.value,
        dictionary.unfilteredTokens,
      ),
    }));
  const scoped = new Set();
  let grown = true;
  while (grown) {
    grown = false;
    for (const { key, references: refs } of references) {
      if (
        !scoped.has(key) &&
        refs.some((ref) => isThemed(ref) || scoped.has(tokenKey(ref)))
      ) {
        scoped.add(key);
        grown = true;
      }
    }
  }
  return scoped;
};

const themeScope = (theme) => `[${htmlAttribute}='${theme}']`;

// Only Flow's values: other libraries put `data-theme` on elements, too.
const themes = ["light", "dark", "system"];

const configVariants = [
  {
    source: "src/**/!(*.dark).yml",
    destination: "base",
    filter: (token) => !isThemed(token),
    options: { warnings: "disabled" },
    cssScopedSelector: `:root, ${themes.map(themeScope).join(", ")}`,
  },
  {
    source: "src/**/!(*.light).yml",
    destination: "all-dark",
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "all-light",
  },
  {
    source: "src/**/!(*.light).yml",
    destination: "colors-dark-system",
    filter: isThemed,
    cssSelector: `:root:not([${htmlAttribute}]), :root${themeScope("system")}, ${themeScope("system")}`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light-system",
    filter: isThemed,
    cssSelector: `:root:not([${htmlAttribute}]), :root${themeScope("system")}, ${themeScope("system")}`,
  },
  {
    source: "src/**/!(*.light).yml",
    destination: "colors-dark",
    filter: isThemed,
    cssSelector: `:root${themeScope("dark")}, ${themeScope("dark")}`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light",
    filter: isThemed,
    cssSelector: `:root${themeScope("light")}, ${themeScope("light")}`,
  },
];

const buildConfig = ({
  source,
  destination,
  cssSelector,
  cssScopedSelector,
  filter = () => true,
}) => ({
  parsers: ["yml-parser"],
  source: [source],
  log: {
    verbosity: "verbose",
  },
  platforms: {
    json: {
      buildPath: "dist/",
      transformGroup: "js",
      files: [
        {
          format: "json",
          destination: `json/${destination}.json`,
          filter: filter,
        },
        {
          format: "json/flow-runtime",
          destination: `json-runtime/${destination}.json`,
          filter: filter,
        },
      ],
      options: {
        outputReferences: false,
      },
    },
    css: {
      transforms: [
        // roughly the predefined css transform group
        // see: https://amzn.github.io/style-dictionary/#/transform_groups?id=css
        "attribute/cti",
        "name/flow-css-var", // here is the customization
        "time/seconds",
        "size/rem",
        "color/css",
      ],
      buildPath: "dist/",
      files: [
        {
          format: "css/variables-flow",
          destination: `css/${destination}.css`,
          filter: filter,
          options: {
            selector: cssSelector,
            scopedSelector: cssScopedSelector,
          },
        },
        {
          format: "css/variables-layered",
          destination: `css-layered/${destination}.css`,
          filter: filter,
          options: {
            selector: cssSelector,
            scopedSelector: cssScopedSelector,
          },
        },
      ],
      options: {
        outputReferences: true,
      },
    },
  },
});

for (const variant of configVariants) {
  const config = buildConfig(variant);
  const dictionary = new StyleDictionary(config, variant.options);
  await dictionary.buildAllPlatforms();
}

/*
 * Checks the output independently of `scopedTokenKeys`: a token declared on
 * `:root` only must not reference a themed or re-declared token, or it keeps
 * the page theme inside a `[data-theme]` section.
 */
const declaredIn = (css) =>
  new Set([...css.matchAll(/^\s*(--[\w-]+):/gm)].map((match) => match[1]));

const themedNames = new Set(
  ["colors-light", "colors-dark"].flatMap((file) => [
    ...declaredIn(fs.readFileSync(`dist/css/${file}.css`, "utf8")),
  ]),
);
const [rootBlock, scopedBlock = ""] = fs
  .readFileSync("dist/css/base.css", "utf8")
  .split(/\n\n(?=\S)/)
  .filter((block) => block.includes("{"));
for (const name of declaredIn(scopedBlock)) {
  themedNames.add(name);
}

const unscoped = [...rootBlock.matchAll(/^\s*(--[\w-]+):(.*)$/gm)]
  .filter(([, , value]) =>
    [...value.matchAll(/var\((--[\w-]+)/g)].some(([, ref]) =>
      themedNames.has(ref),
    ),
  )
  .map(([, name]) => name);

if (unscoped.length > 0) {
  throw new Error(
    `Declared on :root only, but referencing themed tokens: ${unscoped.join(", ")}`,
  );
}
