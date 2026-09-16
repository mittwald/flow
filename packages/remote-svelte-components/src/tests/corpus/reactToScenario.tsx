import * as ReactRemoteComponents from "@mittwald/flow-remote-react-components";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as SvelteComponents from "../../index.js";
import type { ComponentNode, ScenarioNode } from "./scenarioNode.js";
import { UnsupportedScenarioError } from "./scenarioNode.js";
import { svgMarkupToNodes } from "./svgBridge.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

/**
 * The export name of everything in the React remote surface.
 *
 * Both packages export the same names for the same components — that is the
 * whole bridge. The scenario is handed the React bag, so its element types are
 * React components; this maps them back to the name the Svelte bag uses.
 */
const nameOfReactComponent = new Map<unknown, string>();
for (const [name, value] of Object.entries(
  ReactRemoteComponents as AnyRecord,
)) {
  if (typeof value === "function" || typeof value === "object") {
    nameOfReactComponent.set(value, name);
  }
}

const svelteComponents = SvelteComponents as AnyRecord;

/*
 * A host element in a scenario is written as JSX, but it reaches the host as a
 * plain DOM element — so its props have to be the attributes React would have
 * written. `className` and `htmlFor` are React's spellings, and `style` is an
 * object React serializes on the way into the DOM.
 */
const domAttributeName = (key: string): string =>
  key === "className" ? "class" : key === "htmlFor" ? "for" : key;

const kebabCase = (key: string): string =>
  key.startsWith("--")
    ? key
    : key.replaceAll(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const attributeValue = (key: string, value: unknown): string => {
  if (key === "style" && typeof value === "object" && value !== null) {
    return Object.entries(value as Record<string, unknown>)
      .map(([property, entry]) => `${kebabCase(property)}: ${String(entry)}`)
      .join("; ");
  }

  return String(value);
};

const isElementLike = (value: unknown): boolean =>
  isValidElement(value) ||
  (Array.isArray(value) && value.length > 0 && value.every(isValidElement));

/**
 * An icon, or something the binding is missing.
 *
 * A name the Svelte surface does not carry is not automatically a gap: Flow's
 * icons are React components by construction, and their output — an `<svg>` —
 * crosses the boundary unchanged. So render it and look: a single `<svg>` is an
 * icon, anything else is the gap this harness is meant to report.
 */
const bridgeOrFail = (element: ReactElement, name: string): ScenarioNode => {
  let markup: string;

  try {
    markup = renderToStaticMarkup(element);
  } catch (error) {
    throw new UnsupportedScenarioError(
      name,
      `it is not in the Svelte surface and rendering it failed (${String(error)})`,
    );
  }

  const node = svgMarkupToNodes(markup);

  if (!node) {
    throw new UnsupportedScenarioError(
      name,
      "it is not in the Svelte surface and does not render to a single <svg>",
    );
  }

  return node;
};

const nameOf = (type: unknown): string => {
  const name = nameOfReactComponent.get(type);

  if (name) {
    return name;
  }

  const displayName =
    (type as { displayName?: string; name?: string })?.displayName ??
    (type as { name?: string })?.name;

  return displayName ?? "an anonymous component";
};

/**
 * Whether the icon about to be bridged already sits inside an `Icon`.
 *
 * A bridged icon is handed to `Icon` — which is exactly what the README tells a
 * Svelte app to do with a raw `<svg>`, and what lets the host's props context
 * reach it. A scenario that wrote `<Icon><IconInfo /></Icon>` itself must not
 * get a second one.
 */
const reactToScenarioNodesIn = (
  node: ReactNode,
  parent: string | undefined,
): ScenarioNode[] => {
  if (node === null || node === undefined || typeof node === "boolean") {
    return [];
  }

  if (typeof node === "string" || typeof node === "number") {
    return [{ kind: "text", text: String(node) }];
  }

  if (Array.isArray(node)) {
    return node.flatMap((child) => reactToScenarioNodesIn(child, parent));
  }

  if (!isValidElement(node)) {
    throw new UnsupportedScenarioError(
      "an unknown child",
      `a scenario child of type "${typeof node}" is not a React node`,
    );
  }

  const element = node as ReactElement<AnyRecord>;
  const { type, props } = element;

  /* A fragment contributes its children and nothing else. */
  if (typeof type === "symbol") {
    return reactToScenarioNodesIn(props.children, parent);
  }

  /* A host element — a raw `<svg>` or `<div>` a scenario wrote itself. */
  if (typeof type === "string") {
    const { children, ...attributes } = props;
    return [
      {
        kind: "element",
        tag: type,
        attributes: Object.fromEntries(
          Object.entries(attributes)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [
              domAttributeName(key),
              attributeValue(key, value),
            ]),
        ),
        children: reactToScenarioNodesIn(children, type),
      },
    ];
  }

  const name = nameOf(type);

  /*
   * `Wrap` is resolved here rather than rendered.
   *
   * React's version takes the wrapper as its child and renders that child's
   * children when the condition fails — reaching *into* the child. A snippet
   * cannot be reached into, so the Svelte `Wrap` takes the wrapper as a snippet
   * that receives the content instead: a different signature for the same
   * purpose. The corpus writes React's shape, so resolving it produces exactly
   * the tree React's `Wrap` produces, and the Svelte one is covered by its own
   * README example rather than here.
   */
  if (name === "Wrap") {
    const wrapper = reactToScenarioNodesIn(props.children, parent);

    if (props.if) {
      return wrapper;
    }

    return wrapper.flatMap((node) =>
      node.kind === "text" ? [node] : node.children,
    );
  }

  const Component = svelteComponents[name];

  if (!Component) {
    const bridged = bridgeOrFail(element, name);

    if (parent === "Icon") {
      return [bridged];
    }

    return [
      {
        kind: "component",
        name: "Icon",
        props: {},
        slots: {},
        children: [bridged],
      },
    ];
  }

  const componentNode: ComponentNode = {
    kind: "component",
    name,
    props: {},
    slots: {},
    children: reactToScenarioNodesIn(props.children, name),
  };

  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "key" || key === "ref") {
      continue;
    }

    /*
     * A prop carrying rendered output is a slot on both sides — the generator
     * made it one, and the wrapper renders it into `flr-slot-root-wrapper`.
     * Recognised by the value, because that is what the scenario actually
     * passed.
     */
    if (isElementLike(value)) {
      componentNode.slots[key] = reactToScenarioNodesIn(
        value as ReactNode,
        undefined,
      );
      continue;
    }

    componentNode.props[key] = value;
  }

  return [componentNode];
};

export const reactToScenarioNodes = (node: ReactNode): ScenarioNode[] =>
  reactToScenarioNodesIn(node, undefined);
