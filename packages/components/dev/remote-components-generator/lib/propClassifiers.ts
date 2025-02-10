import type { ComponentDoc } from "react-docgen-typescript";
import { checkTagListIncludes } from "./docTags";

export const isEvent = (name: string) => /^on[A-Z].*$/.test(name);

export const isSlot = (comp: ComponentDoc, name: string) =>
  checkTagListIncludes(comp.tags, "slot-props", name) ||
  comp.props[name]?.type.name === "ReactNode";

export const isProp = (comp: ComponentDoc, name: string) =>
  !isSlot(comp, name) && !isEvent(name) && !isAttribute(comp, name);

export const isAttribute = (comp: ComponentDoc, name: string) =>
  !isSlot(comp, name) &&
  !isEvent(name) &&
  ["boolean", "string", "number"].includes(comp.props[name]?.type.name ?? "") &&
  // @todo fix attribute problems with camel case and parsing of number/boolean values
  false;
