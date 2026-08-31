import yaml from "js-yaml";
import StyleDictionary from "style-dictionary";
import { fileHeader, formattedVariables } from "style-dictionary/utils";
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
 * The `json` format emits every token with its build metadata — `filePath`,
 * `isSource`, `original`, `attributes` and more. That is 94 % of the file, and
 * none of it means anything in a browser: it turns 49 KB of values into 834 KB.
 * Runtime consumers (`useDesignTokens`) import this leaner tree instead, which
 * keeps only the two fields they read.
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

StyleDictionary.registerFormat({
  name: "css/variables-layered",
  format: async ({ dictionary, options = {}, file }) => {
    const selector = Array.isArray(options.selector)
      ? options.selector
      : options.selector
        ? [options.selector]
        : [":root"];
    const {
      outputReferences,
      outputReferenceFallbacks,
      usesDtcg,
      formatting,
      sort,
    } = options;
    const indentation = formatting?.indentation ?? "  ";
    const header = await fileHeader({ file, formatting, options });

    const variables = formattedVariables({
      format: propertyFormatNames.css,
      dictionary,
      outputReferences,
      outputReferenceFallbacks,
      formatting: {
        ...formatting,
        indentation: indentation.repeat(selector.length + 1),
      },
      usesDtcg,
      sort,
    });

    const nestedVariables = selector
      .slice()
      .reverse()
      .reduce(
        (content, currentSelector, index) =>
          `${indentation.repeat(selector.length - index)}${currentSelector} {\n` +
          content +
          `\n${indentation.repeat(selector.length - index)}}`,
        variables,
      );

    return `${header}@layer flow.tokens {\n${nestedVariables}\n}\n`;
  },
});

const htmlAttribute = "data-theme";

const configVariants = [
  {
    source: "src/**/!(*.dark).yml",
    destination: "base",
    filter: (token) => token.path[0] !== "color",
    options: { warnings: "disabled" },
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
    filter: (token) => token.path[0] === "color",
    cssSelector: `:root:not([${htmlAttribute}]), :root[${htmlAttribute}='system']`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light-system",
    filter: (token) => token.path[0] === "color",
    cssSelector: `:root:not([${htmlAttribute}]), :root[${htmlAttribute}='system']`,
  },
  {
    source: "src/**/!(*.light).yml",
    destination: "colors-dark",
    filter: (token) => token.path[0] === "color",
    cssSelector: `:root[${htmlAttribute}='dark']`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light",
    filter: (token) => token.path[0] === "color",
    cssSelector: `:root[${htmlAttribute}='light']`,
  },
];

const buildConfig = ({
  source,
  destination,
  cssSelector,
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
          format: "css/variables",
          destination: `css/${destination}.css`,
          filter: filter,
          options: {
            selector: cssSelector,
          },
        },
        {
          format: "css/variables-layered",
          destination: `css-layered/${destination}.css`,
          filter: filter,
          options: {
            selector: cssSelector,
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
