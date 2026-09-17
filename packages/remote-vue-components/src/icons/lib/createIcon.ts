/**
 * The runtime behind the generated icons in `../components`.
 *
 * A Flow icon is not a remote element: it is Flow's `Icon` with an `<svg>`
 * inside it, and the host merges its own classes and ARIA onto that very
 * element. So the binding's job is to emit the same `<svg>` React emits — path
 * data, Tabler's default attribute set, and the `tabler-icon…` classes — and
 * let the host do the rest.
 *
 * Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. The attribute
 * sets below are adapted from `@tabler/icons-react`; see this package's
 * LICENSE.
 */
import { Icon } from "@/auto-generated";
import { injectContextIcon } from "@/icons/IconSetProvider";
import type { IconName } from "@/icons/iconNames";
import { defineComponent, h, type Component, type VNode } from "vue";

export type SvgAttributes = Record<string, string | number>;

/** A leaf element of an icon: tag name plus its attributes. */
export type SvgChild = [tag: string, attributes: SvgAttributes];

/** A custom icon's markup, as parsed from `icons.yaml`. */
export interface SvgNode {
  tag: string;
  attributes: SvgAttributes;
  children: SvgNode[];
}

export type TablerIconType = "outline" | "filled";

/*
 * What `createTablerIcon` in `@mittwald/flow-icons` ends up with once its
 * `size`, `stroke` and `color` defaults are applied. Resolved here rather than
 * per render: a remote icon never takes those props — Flow's `Icon` sizes and
 * colours it through CSS, on the host.
 */
const tablerAttributes: Record<TablerIconType, SvgAttributes> = {
  outline: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  },
  filled: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none",
  },
};

/*
 * Every attribute is forced to *be* an attribute (`^`): Vue would otherwise set
 * a matching DOM property, and an SVG element's properties are read-only
 * `SVGAnimatedLength`s rather than the strings the host has to receive.
 */
const asAttributes = (attributes: SvgAttributes): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(attributes).map(([name, value]) => [`^${name}`, value]),
  );

const svgVNode = (node: SvgNode): VNode =>
  h(node.tag, asAttributes(node.attributes), node.children.map(svgVNode));

/*
 * Widened on purpose: `Icon`'s generated type names Flow's `Icon` props one by
 * one, and what arrives here is the caller's `attrs` — an open record. The
 * component the caller writes is typed; this is the one hop where the props are
 * only forwarded, and narrowing it would mean restating the contract.
 */
const IconElement = Icon as Component;

/** Flow's `Icon` around an `<svg>`, with everything the caller passed on it. */
const flowIcon = (name: IconName, renderSvg: () => VNode): Component =>
  defineComponent({
    name: `Icon${name}`,
    /*
     * The props are Flow `Icon`'s, not this component's — `size`, `color`, an
     * `aria-label`. Declaring them would mean copying that contract; passing
     * `attrs` on hands the element the same set React forwards to `IconView`.
     */
    inheritAttrs: false,
    setup(_props, { attrs }) {
      /*
       * The swap happens on the `<svg>`, not on the `Icon` around it — a
       * replacement is another icon, and it gets Flow's sizing, colour and
       * ARIA like the built-in one. Same place React's `useContextIcon` does
       * it.
       */
      const replacement = injectContextIcon(name);

      return () =>
        h(IconElement, attrs, {
          default: () => [
            replacement.value ? h(replacement.value) : renderSvg(),
          ],
        });
    },
  });

/** A Tabler icon, from the path data inlined into the generated file. */
export const tablerIcon = (
  name: IconName,
  type: TablerIconType,
  tablerName: string,
  children: SvgChild[],
): Component =>
  flowIcon(name, () =>
    svgVNode({
      tag: "svg",
      attributes: {
        ...tablerAttributes[type],
        class: `tabler-icon tabler-icon-${tablerName}`,
      },
      children: children.map(([tag, attributes]) => ({
        tag,
        attributes,
        children: [],
      })),
    }),
  );

/** An icon `icons.yaml` defines as markup of its own. */
export const svgIcon = (name: IconName, root: SvgNode): Component =>
  flowIcon(name, () => svgVNode(root));
