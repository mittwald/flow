import { getIconDefinitions, type IconCategory } from "./definitions";
import { parseSvg, type SvgNode } from "./svg";
import { getTablerIcon } from "./tabler";

/** A single SVG child of a Tabler icon: tag name plus its attributes. */
export type TablerIconNode = [
  tag: string,
  attributes: Record<string, string | number>,
][];

interface IconSourceBase {
  category?: IconCategory;
  deprecated?: boolean;
}

export interface TablerIconSource extends IconSourceBase {
  kind: "tabler";
  /** Selects Tabler's default `<svg>` attribute set. */
  type: "outline" | "filled";
  /** Kebab-case name, used for the `tabler-icon-<name>` class. */
  name: string;
  node: TablerIconNode;
}

export interface SvgIconSource extends IconSourceBase {
  kind: "svg";
  root: SvgNode;
}

export type IconSource = TablerIconSource | SvgIconSource;

/**
 * The default icon set as data, with no framework in it.
 *
 * The React generators turn `icons.yaml` straight into components; a second
 * binding needs the same icons and cannot import those. This is the shared
 * middle: path data from Tabler, custom SVG parsed into a node tree, and
 * nothing that presumes how it will be rendered.
 *
 * The **pro** set is not here on purpose. Its path data comes from
 * `@fortawesome/sharp-regular-svg-icons`, a Pro package each consumer licenses
 * itself — inlining it would redistribute Pro assets, which is why
 * `packages/icons-pro` imports it at runtime instead of generating from it.
 */
export const getIconSources = (): Record<string, IconSource> => {
  const definitions = getIconDefinitions("./icons.yaml");

  return Object.fromEntries(
    Object.entries(definitions).map(([iconName, definition]) => {
      const { category, deprecated } = definition;

      if (definition.svg) {
        return [
          iconName,
          { kind: "svg", root: parseSvg(definition.svg), category, deprecated },
        ];
      }

      if (!definition.tb) {
        throw new Error(
          `Icon "${iconName}" has neither a custom "svg" nor a Tabler name, ` +
            `so it cannot be resolved without a vendor package.`,
        );
      }

      return [
        iconName,
        {
          kind: "tabler",
          ...getTablerIcon(definition.tb),
          category,
          deprecated,
        },
      ];
    }),
  );
};
