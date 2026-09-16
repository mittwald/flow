import type { ElementNode, ScenarioNode } from "./scenarioNode.js";

/**
 * Turns a rendered `<svg>` into scenario nodes.
 *
 * Flow's icons are React components, and there is no Svelte icon set. What
 * there is, is the output: an `<svg>`. Plain elements travel through the remote
 * tree like any other node, so rendering the React icon to static markup and
 * rebuilding it here is not a workaround — it is the same thing a Svelte app
 * does by hand when it puts an `<svg>` inside `Icon`.
 *
 * It is also what lets the corpus run at all: a quarter of its files would
 * otherwise fail on an icon rather than on anything about the binding.
 */
const toNode = (element: Element): ElementNode => ({
  kind: "element",
  tag: element.tagName,
  attributes: Object.fromEntries(
    [...element.attributes].map((attribute) => [
      attribute.name,
      attribute.value,
    ]),
  ),
  children: [...element.childNodes].flatMap((child): ScenarioNode[] => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      return [toNode(child as Element)];
    }
    if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
      return [{ kind: "text", text: child.nodeValue }];
    }
    return [];
  }),
});

/**
 * Parses static markup into nodes, or returns `undefined` when it is not a
 * single element — which is how the caller tells an icon from a component it
 * genuinely cannot render.
 *
 * Flow's own classes and the inline `style` are dropped from the root: the icon
 * is handed to `Icon`, and `Icon` is what puts them back — including the ones
 * its surroundings contribute through the props context (`flow--button--icon`
 * on an icon inside a `Button`), which a pre-rendered SVG could not have known
 * about.
 *
 * The `style` in particular has to go. A Flow icon renders `color="#0fdf00"` as
 * an inline style, and the host builds a plain `<svg>` with `createElement`,
 * where a `style` string is not a valid React prop — it throws and takes the
 * whole scenario down with it. The colour travels on the `Icon` instead, which
 * is where it came from.
 */
export const svgMarkupToNodes = (markup: string): ElementNode | undefined => {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();

  const [element, ...rest] = [...template.content.children];

  if (!element || rest.length > 0 || element.tagName.toLowerCase() !== "svg") {
    return undefined;
  }

  const node = toNode(element);

  delete node.attributes.style;

  const className = node.attributes.class;

  if (className !== undefined) {
    const kept = className
      .split(/\s+/)
      .filter((name) => name && !name.startsWith("flow--"));

    if (kept.length > 0) {
      node.attributes.class = kept.join(" ");
    } else {
      delete node.attributes.class;
    }
  }

  return node;
};
