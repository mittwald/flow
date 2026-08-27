import type { ComponentDoc } from "react-docgen-typescript";
import { checkTagListIncludes } from "./docTags";

export const isEvent = (name: string) => /^on[A-Z].*$/.test(name);

/*
 * A prop that carries rendered output has to become a slot. As a plain remote
 * property it is serialized as data, and a React element carries
 * `$$typeof: Symbol(react.element)` — `postMessage` refuses symbols, which
 * fails the whole mutation batch, not just the prop.
 *
 * `ReactNode` is reported as a bare name, `ReactElement` instantiated, e.g.
 * `ReactElement<unknown, string | JSXElementConstructor<any>>`. The match is
 * anchored on purpose: every event prop is typed
 * `AdaptChild*EventHandler<any, ReactElement<...>>`, and an unanchored match
 * would turn all of them into slots.
 */
const isElementType = (type = "") =>
  type === "ReactNode" || /^ReactElement(<|$)/.test(type);

export const isSlot = (comp: ComponentDoc, name: string) =>
  checkTagListIncludes(comp.tags, "slot-props", name) ||
  isElementType(comp.props[name]?.type.name);

export const isProp = (comp: ComponentDoc, name: string) =>
  !isSlot(comp, name) && !isEvent(name) && !isAttribute(comp, name);

export const isAttribute = (comp: ComponentDoc, name: string) =>
  !isSlot(comp, name) &&
  !isEvent(name) &&
  ["boolean", "string", "number"].includes(comp.props[name]?.type.name ?? "") &&
  // @todo fix attribute problems with camel case and parsing of number/boolean values
  false;
