import type { IconDefinition, IconDefinitions } from "./definitions";
import { getTablerIcon } from "./tabler";

/**
 * The Svelte icon set, generated from the same `icons.yaml` as the React one.
 *
 * Shaped after what `packages/components` exposes rather than after
 * `packages/icons`: there an icon is a **wrapper** — `<IconView {...props}><Svg
 * /></IconView>` — so `<IconStar size="s" />` passes `Icon`'s props, and the
 * raw `<svg>` is its child, rendered with its own defaults and no props at all.
 * `size` therefore means what it means on `Icon` (`"s"`, `"m"`, `"l"`), not a
 * pixel count, exactly as in React. A Svelte app writes the same thing, and the
 * host applies the same classes and props context.
 *
 * Only the default (Tabler) set. FontAwesome stays imported at runtime because
 * it is a Pro package each consumer licenses itself, and there is no Svelte
 * binding for it here — see this package's AGENTS.md.
 */
const header = `\
<!-- prettier-ignore -->
<!-- This file is auto-generated with the icon generator -->
`;

/*
 * Tabler's own `<svg>` attribute sets, as `createTablerIcon` applies them —
 * written in DOM spelling, because this is markup rather than JSX.
 */
const svgAttributes = (
  type: "outline" | "filled",
  iconName: string,
): string => {
  const shared = `xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"`;
  const paint =
    type === "filled"
      ? `fill="currentColor" stroke="none"`
      : `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

  return `${shared} ${paint} class="tabler-icon tabler-icon-${iconName}"`;
};

/*
 * JSX attribute names that are spelled differently in markup. `viewBox` and the
 * other genuinely camelCase SVG attributes are deliberately absent — they are
 * the same in both.
 */
const jsxAttributeRenames: Record<string, string> = {
  className: "class",
  strokeWidth: "stroke-width",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeDasharray: "stroke-dasharray",
  strokeMiterlimit: "stroke-miterlimit",
  strokeOpacity: "stroke-opacity",
  fillRule: "fill-rule",
  fillOpacity: "fill-opacity",
  clipRule: "clip-rule",
  clipPath: "clip-path",
  stopColor: "stop-color",
  stopOpacity: "stop-opacity",
  textAnchor: "text-anchor",
  dominantBaseline: "dominant-baseline",
  fontSize: "font-size",
  fontFamily: "font-family",
  paintOrder: "paint-order",
  vectorEffect: "vector-effect",
  shapeRendering: "shape-rendering",
};

/*
 * Whitespace between two tags is a text node, and in the remote tree the host
 * renders it as a child of the `<svg>`. The source in `icons.yaml` is written
 * across several lines, so it is collapsed here.
 */
const compactMarkup = (svg: string): string =>
  svg
    .replaceAll(/\s*\n\s*/g, " ")
    .replaceAll(/>\s+</g, "><")
    .trim();

const toMarkupAttributes = (svg: string): string =>
  Object.entries(jsxAttributeRenames).reduce(
    (markup, [jsx, dom]) => markup.replaceAll(`${jsx}=`, `${dom}=`),
    svg,
  );

/** The SVG children, written out rather than looped over. */
const tablerChildren = (
  node: [tag: string, attributes: Record<string, string | number>][],
): string =>
  node
    .map(([tag, attributes]) => {
      const rendered = Object.entries(attributes)
        .map(([name, value]) => ` ${name}="${value}"`)
        .join("");
      return `<${tag}${rendered} />`;
    })
    .join("");

/*
 * The branch sits *outside* `<Icon>`, so its anchors land in the parent rather
 * than inside `flr-icon`. `Icon` takes `Children.toArray(children)[0]` and
 * would survive one, but a component that counts its children — `Initials`,
 * `Markdown` — does not, and the rule is worth keeping uniform.
 *
 * The replacement is rendered without props, as React's generated icons do:
 * `size` and `color` belong to `Icon`, not to the icon inside it.
 */
const iconBody = (svg: string): string =>
  `{#if ContextIcon}<Icon {...props}><ContextIcon /></Icon>{:else}<Icon {...props}>${svg}</Icon>{/if}`;

const tablerIconFile = (iconName: string, vendorIconName: string): string => {
  const { type, name, node } = getTablerIcon(vendorIconName);

  /*
   * No `{#each}` over the paths, and no `<svelte:element>`: a block or a render
   * tag leaves a comment anchor inside the element, and remote-dom carries a
   * comment across as a child. The path data is fixed at generation time, so it
   * is written out — the same reason the component generator writes its tag
   * literally.
   */
  return `${header}<script lang="ts">
  /* Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. See LICENSE. */
  import Icon from "../auto-generated/Icon.svelte";
  import type { FlowIconProps } from "../lib/iconProps.js";
  import { useContextIcon } from "../lib/iconSet.js";

  let props: FlowIconProps = $props();

  const ContextIcon = useContextIcon("${iconName}");
</script>

${iconBody(`<svg ${svgAttributes(type, name)}>${tablerChildren(node)}</svg>`)}
`;
};

const customSvgIconFile = (
  iconName: string,
  iconSvg: string,
): string => `${header}<script lang="ts">
  import Icon from "../auto-generated/Icon.svelte";
  import type { FlowIconProps } from "../lib/iconProps.js";
  import { useContextIcon } from "../lib/iconSet.js";

  let props: FlowIconProps = $props();

  const ContextIcon = useContextIcon("${iconName}");
</script>

${iconBody(compactMarkup(toMarkupAttributes(iconSvg)))}
`;

export const getSvelteIconFileContent = (
  iconName: string,
  icon: IconDefinition,
): string => {
  if (icon.svg) {
    return customSvgIconFile(iconName, icon.svg);
  }

  if (!icon.tb) {
    throw new Error(
      `Icon "${iconName}" has neither a Tabler definition nor a custom svg, ` +
        "so it cannot be generated for Svelte.",
    );
  }

  return tablerIconFile(iconName, icon.tb);
};

/** The icon names, so an `IconSet`'s keys are checked. */
export const getSvelteIconNamesFileContent = (icons: IconDefinitions): string =>
  `export type FlowIconName =\n${Object.keys(icons)
    .map((icon) => `  | "${icon}"`)
    .join("\n")};\n`;

export const getSvelteIconIndexFileContent = (icons: IconDefinitions): string =>
  Object.keys(icons)
    .map(
      (icon) =>
        `export { default as Icon${icon} } from "./Icon${icon}.svelte";`,
    )
    .join("");
