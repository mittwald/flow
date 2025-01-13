import type { ComponentDoc } from "react-docgen-typescript";
import { checkTagListIncludes } from "./docTags";

export const isEvent = (name: string) => /^on[A-Z].*$/.test(name);

export const isSlot = (comp: ComponentDoc, name: string) =>
  checkTagListIncludes(comp.tags, "slot-props", name);

export const isProp = (comp: ComponentDoc, name: string) =>
  !isSlot(comp, name) && !isEvent(name);
