import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import StyleDictionary from "style-dictionary";
import {
  fileHeader,
  formattedVariables,
  getReferences,
  usesReferences,
} from "style-dictionary/utils";
import { propertyFormatNames } from "style-dictionary/enums";

/*
 * Color token tiers (docs/adr/0008-color-token-tiers.md). Every file belongs to
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
  "background-gradient",
];

/**
 * Brand gradients: `gradient-<name>`, one `color` per theme pointing to Brand.
 * They have no quiet/strong shape.
 */
const isGradientGroup = (group) => group.startsWith("gradient-");

/** The keys each Semantic group holds under `color`. */
const steps = ["100", "200", "300"];
const semanticShapes = {
  default: ["quiet", "strong"].flatMap((tone) =>
    steps.map((step) => `${tone}.${step}`),
  ),
  elevation: steps,
  border: steps,
  content: [...steps, "inverse"],
  // Decorative groups add one content tone for Icon and Color.
  decorative: [
    ...["quiet", "strong"].flatMap((tone) =>
      steps.map((step) => `${tone}.${step}`),
    ),
    "content",
  ],
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

/** Fails the build on any color reference ADR 0008 forbids. */
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

  // Semantic roles: the neutral roles count 100–300, every other
  // group holds quiet and strong 100–300. A step outside the shape is a new
  // role and needs a decision, not a key.
  const keysByGroup = Map.groupBy(
    [...light].filter((key) => {
      const group = key.split(".")[0];
      return !semanticLiteralGroups.includes(group) && !isGradientGroup(group);
    }),
    (key) => key.split(".")[0],
  );
  for (const [group, keys] of keysByGroup) {
    const expected =
      semanticShapes[group] ??
      (group.startsWith("decorative-")
        ? semanticShapes.decorative
        : semanticShapes.default);
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
      `Color tier check failed (docs/adr/0008-color-token-tiers.md):\n${errors.join("\n")}`,
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

// Semantic is the only color tier that switches with the theme (ADR 0008);
// with the `texture` tokens it is all the per-theme files carry. Every other
// token is emitted once in `base`.
const isThemed = (token) =>
  colorTier(token.filePath) === "semantic" || token.path[0] === "texture";
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
    options: { warnings: "disabled" },
    cssSelector: `:root:not([${htmlAttribute}]), :root${themeScope("system")}, ${themeScope("system")}`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light-system",
    filter: isThemed,
    options: { warnings: "disabled" },
    cssSelector: `:root:not([${htmlAttribute}]), :root${themeScope("system")}, ${themeScope("system")}`,
  },
  {
    source: "src/**/!(*.light).yml",
    destination: "colors-dark",
    filter: isThemed,
    options: { warnings: "disabled" },
    cssSelector: `:root${themeScope("dark")}, ${themeScope("dark")}`,
  },
  {
    source: "src/**/!(*.dark).yml",
    destination: "colors-light",
    filter: isThemed,
    options: { warnings: "disabled" },
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
