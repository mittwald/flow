import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server.browser";
import * as VueComponents from "@mittwald/flow-remote-vue-components";
import * as ReactComponents from "@mittwald/flow-remote-react-components";
import { Fragment, h, type Component, type VNode } from "vue";

/**
 * Rebuilds a scenario's React element tree as Vue vnodes.
 *
 * The visual scenarios are written once, in JSX, against an injected components
 * bag. A React element is plain data — `{ type, props, key }` — so the same
 * tree can be handed to Vue as long as every `type` has a Vue counterpart. Both
 * packages export the same names for the same `flr-*` element, which is what
 * makes the lookup a name lookup.
 *
 * What this deliberately does not support: a render prop, a function as
 * children, or a component a scenario defines itself. None appear in the
 * corpus, and each would describe something a remote tree cannot carry anyway.
 */

type VueChild = VNode | string;

/** React component → its export name, so the Vue bag can be asked for it. */
const nameOfReactComponent = new Map<unknown, string>(
  Object.entries(ReactComponents).map(([name, value]) => [value, name]),
);

const vueComponents = VueComponents as unknown as Record<string, Component>;

export class UnsupportedScenarioError extends Error {
  public constructor(what: string) {
    super(`This scenario cannot be expressed in Vue: ${what}.`);
    this.name = "UnsupportedScenarioError";
  }
}

const isFlowIcon = (name: string | undefined): boolean =>
  name !== undefined && /^Icon[A-Z]/.test(name);

/**
 * A component from outside Flow, rendered to the `<svg>` it produces — or
 * `undefined` when it produces something else.
 *
 * Not restricted to functions: a Tabler icon is a `forwardRef` object, which is
 * the shape the scenarios actually import. Anything that fails to render simply
 * is not an icon, and the caller reports the missing counterpart instead.
 */
const renderForeignSvg = (element: ReactElement): VNode | undefined => {
  let root: Element | undefined;
  try {
    root = parseElement(renderToStaticMarkup(element));
  } catch {
    return undefined;
  }

  if (root?.nodeName.toLowerCase() !== "svg") {
    return undefined;
  }

  const svg = domToVNode(root);
  return typeof svg === "object" ? svg : undefined;
};

/** Parses rendered markup, or `undefined` when it is not a single element. */
const parseElement = (markup: string): Element | undefined => {
  const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
  const root = parsed.documentElement;
  return root.nodeName === "parsererror" ? undefined : root;
};

/** A parsed SVG subtree, as vnodes. Attributes carry over verbatim. */
const domToVNode = (node: Node): VueChild | undefined => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }
  if (!(node instanceof Element)) {
    return undefined;
  }

  const props: Record<string, unknown> = {};
  for (const attribute of Array.from(node.attributes)) {
    /*
     * Forced to attributes: Vue would otherwise set a matching DOM property,
     * and an SVG element's properties are read-only `SVGAnimatedLength`s rather
     * than the strings the host has to receive.
     */
    props[`^${attribute.name}`] = attribute.value;
  }

  const children = Array.from(node.childNodes)
    .map(domToVNode)
    .filter((child): child is VueChild => child !== undefined);

  return h(node.tagName.toLowerCase(), props, children);
};

/**
 * A React icon, as the SVG inside a Vue `Icon`.
 *
 * `IconInfo` and friends are `Icon` wrapping a path set — which is why the
 * bridge is not "render it to markup and hand that to the host": an `<svg>`
 * placed bare never gets the classes a surrounding component's props context
 * puts on `Icon` (`flow--button--icon`), and the host renders a subtly
 * different tree. Wrapping is also exactly what an extension has to do with a
 * foreign SVG; see the package README.
 *
 * Flow's own classes and the inline style are stripped from the markup: the
 * host's `Icon` derives both from the props forwarded below, and a `style`
 * baked into the SVG would reach it a second time — as a string, which is not
 * what React accepts for a `style` prop ("expects a mapping ... not a
 * string").
 */
const flowIconVNode = (element: ReactElement): VNode => {
  const root = parseElement(renderToStaticMarkup(element));

  if (!root) {
    throw new UnsupportedScenarioError("an icon whose markup did not parse");
  }

  root.removeAttribute("style");

  const ownClasses = (root.getAttribute("class") ?? "")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !token.startsWith("flow--"));
  if (ownClasses.length > 0) {
    root.setAttribute("class", ownClasses.join(" "));
  } else {
    root.removeAttribute("class");
  }

  const svg = domToVNode(root);
  if (typeof svg !== "object") {
    throw new UnsupportedScenarioError("an icon that rendered no element");
  }

  const { props } = element as ReactElement & {
    props: Record<string, unknown>;
  };
  const iconProps = Object.fromEntries(
    Object.entries(props).filter(([name]) => name !== "children"),
  );

  const Icon = vueComponents.Icon;
  if (!Icon) {
    throw new UnsupportedScenarioError("no Vue Icon to wrap an icon in");
  }

  return h(Icon, iconProps, { default: () => [svg] });
};

/**
 * React's props for a host element, as Vue's.
 *
 * Everything but `class` and `style` is forced to an attribute: Vue would
 * otherwise set a matching DOM property, and it is the attribute that the
 * remote tree mirrors to the host.
 */
const intrinsicProps = (
  props: Record<string, unknown>,
  key: string | number | null,
): Record<string, unknown> => {
  const vueProps: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(props)) {
    if (name === "children") {
      continue;
    }
    if (name === "className") {
      vueProps.class = value;
      continue;
    }
    if (name === "style") {
      vueProps.style = value;
      continue;
    }
    vueProps[`^${name}`] = value;
  }

  if (key !== null) {
    vueProps.key = key;
  }

  return vueProps;
};

const toVNodeChildren = (children: ReactNode): VueChild[] => {
  if (
    children === null ||
    children === undefined ||
    typeof children === "boolean"
  ) {
    return [];
  }
  if (Array.isArray(children)) {
    return children.flatMap((child) => toVNodeChildren(child as ReactNode));
  }
  if (typeof children === "string" || typeof children === "number") {
    return [String(children)];
  }
  if (isValidElement(children)) {
    return [toVNode(children)];
  }
  throw new UnsupportedScenarioError(`a child of type ${typeof children}`);
};

export const toVNode = (element: ReactElement): VNode => {
  const { type, props, key } = element as ReactElement & {
    props: Record<string, unknown>;
  };

  if (type === (Fragment as unknown)) {
    return h(
      Fragment,
      { key } as Record<string, unknown>,
      toVNodeChildren(props.children as ReactNode),
    );
  }

  /*
   * A plain element the scenario wrote itself (`<strong>`, `<svg>`). Those are
   * not components on either side: they travel through the remote tree as
   * ordinary nodes, which is the whole reason an extension can hand the host a
   * raw SVG.
   */
  if (typeof type === "string") {
    return h(
      type,
      intrinsicProps(props, key),
      toVNodeChildren(props.children as ReactNode),
    );
  }

  const name = nameOfReactComponent.get(type);

  if (isFlowIcon(name)) {
    return flowIconVNode(element);
  }

  if (name === undefined || vueComponents[name] === undefined) {
    /*
     * A component from outside Flow — a Tabler icon the scenario wrapped in
     * `<Icon>` itself. Anything whose output is an `<svg>` can be handed over
     * as that `<svg>`: it travels as ordinary remote DOM, and whatever wrapped
     * it in the scenario has already been converted. Rendered as-is, with no
     * stripping and no wrapping, because it is not a Flow icon.
     */
    const foreign = renderForeignSvg(element);
    if (foreign) {
      return foreign;
    }

    throw new UnsupportedScenarioError(
      `no Vue counterpart for ${name ?? String(type)}`,
    );
  }

  const vueProps: Record<string, unknown> = {};
  const slots: Record<string, () => VueChild[]> = {};

  for (const [propName, value] of Object.entries(props)) {
    if (propName === "children") {
      continue;
    }
    /*
     * A prop holding rendered output is a slot on both sides — as a property it
     * would not survive structured clone. Which props those are is the element
     * class's business, and the Vue factory ignores a slot it does not declare,
     * so handing it over as a slot is safe either way.
     */
    if (isValidElement(value)) {
      /*
       * Converted once here only to let a failure escape: inside the slot
       * closure it would run during Vue's render, where `RemoteRoot` catches it
       * and reports it to the host as a connection error — leaving the harness
       * to time out on an empty tree instead of naming the component.
       */
      toVNode(value);
      slots[propName] = () => [toVNode(value)];
      continue;
    }
    vueProps[propName] = value;
  }

  if (key !== null) {
    vueProps.key = key;
  }

  const children = toVNodeChildren(props.children as ReactNode);
  if (children.length > 0) {
    slots.default = () => children;
  }

  return h(vueComponents[name], vueProps, slots);
};
