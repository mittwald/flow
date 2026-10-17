import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import StyleDictionary from "style-dictionary";
import { fileHeader, formattedVariables } from "style-dictionary/utils";
import { propertyFormatNames } from "style-dictionary/enums";

/*
 * Color token tiers (docs/adr/0007-color-token-tiers.md). Every file belongs to
 * one tier; files outside the four color files count as component tokens.
 */
const colorTier = (filePath) => {
  const name = path.basename(filePath);
  if (name === "color-brand.yml") return "brand";
  if (/^color-semantic\.(light|dark)\.yml$/.test(name)) return "semantic";
  if (name === "color-variant.yml") return "variant";
  return "component";
};

/** The tiers a token of each tier may reference. */
const allowedReferences = {
  brand: [],
  semantic: ["brand"],
  variant: ["semantic"],
  component: ["semantic", "variant", "component"],
};

/** Semantic groups that hold literals: Flow owns these colors outright. */
const semanticLiteralGroups = [
  "transparent",
  "categorical",
  "code-syntax",
  "gradient",
  "background-gradient",
];

/** The keys each Semantic group holds under `color` (#3455). */
const steps = ["100", "200", "300"];
const semanticShapes = {
  default: ["quiet", "strong"].flatMap((tone) =>
    steps.map((step) => `${tone}.${step}`),
  ),
  elevation: steps,
  content: [...steps, "inverse"],
};

const collectTokens = (node, file, tokenPath = [], collector = []) => {
  if (node && typeof node === "object" && "value" in node) {
    collector.push({ file, path: tokenPath, value: node.value });
  } else if (node && typeof node === "object") {
    for (const [key, child] of Object.entries(node)) {
      collectTokens(child, file, [...tokenPath, key], collector);
    }
  }
  return collector;
};

/** Fails the build on any color reference ADR 0007 forbids. */
const checkColorTiers = () => {
  const tokens = fs
    .globSync("src/**/*.yml")
    .flatMap((file) =>
      collectTokens(yaml.load(fs.readFileSync(file, "utf8")), file),
    );
  const tierByPath = new Map(
    tokens.map((token) => [token.path.join("."), colorTier(token.file)]),
  );
  const errors = [];

  for (const token of tokens) {
    const tier = colorTier(token.file);
    const name = `${token.path.join(".")} (${token.file})`;
    const references = [...String(token.value).matchAll(/\{([^}]+)\}/g)].map(
      (match) => match[1],
    );

    if (references.length === 0) {
      if (tier === "variant") {
        errors.push(`${name}: a Variant token must reference Semantic`);
      }
      if (
        tier === "semantic" &&
        !semanticLiteralGroups.includes(token.path[0])
      ) {
        errors.push(`${name}: a Semantic token must reference Brand`);
      }
    }

    for (const reference of references) {
      const referencedTier = tierByPath.get(reference);
      if (referencedTier && !allowedReferences[tier].includes(referencedTier)) {
        errors.push(
          `${name}: ${tier} must not reference ${referencedTier} {${reference}}`,
        );
      }
    }
  }

  const semanticKeys = (theme) =>
    tokens
      .filter((token) => token.file.endsWith(`color-semantic.${theme}.yml`))
      .map((token) => token.path.join("."));
  const light = new Set(semanticKeys("light"));
  const dark = new Set(semanticKeys("dark"));
  for (const key of light.symmetricDifference(dark)) {
    errors.push(`${key}: defined for only one theme in color-semantic.*.yml`);
  }

  // Semantic roles (#3455): the neutral roles count 100–300, every other
  // group holds quiet and strong 100–300. A step outside the shape is a new
  // role and needs a decision, not a key.
  const keysByGroup = Map.groupBy(
    [...light].filter(
      (key) => !semanticLiteralGroups.includes(key.split(".")[0]),
    ),
    (key) => key.split(".")[0],
  );
  for (const [group, keys] of keysByGroup) {
    const expected = semanticShapes[group] ?? semanticShapes.default;
    const actual = keys.map((key) => key.split(".").slice(2).join("."));
    if (
      actual.length !== expected.length ||
      !expected.every((key) => actual.includes(key))
    ) {
      errors.push(
        `${group}: Semantic shape must be ${expected.join(", ")} (got ${actual.join(", ")})`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Color tier check failed (docs/adr/0007-color-token-tiers.md):\n${errors.join("\n")}`,
    );
  }
};

checkColorTiers();

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

// Semantic is the only color tier that switches with the theme (ADR 0007);
// with the `texture` tokens it is all the per-theme files carry. Every other
// token is emitted once in `base`.
const isThemed = (token) =>
  colorTier(token.filePath) === "semantic" || token.path[0] === "texture";

const configVariants = [
  {
    source: "src/**/!(*.dark).yml",
    destination: "base",
    filter: (token) => !isThemed(token),
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
    filter: isThemed,
    options: { warnings: "disabled" },
    cssSelector: `:root:not([${htmlAttribute}]), :root[${htmlAttribute}='system']`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light-system",
    filter: isThemed,
    options: { warnings: "disabled" },
    cssSelector: `:root:not([${htmlAttribute}]), :root[${htmlAttribute}='system']`,
  },
  {
    source: "src/**/!(*.light).yml",
    destination: "colors-dark",
    filter: isThemed,
    options: { warnings: "disabled" },
    cssSelector: `:root[${htmlAttribute}='dark']`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light",
    filter: isThemed,
    options: { warnings: "disabled" },
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
