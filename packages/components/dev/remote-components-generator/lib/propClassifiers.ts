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

const closing: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

/**
 * The top-level members of a union as react-docgen-typescript prints it:
 * `boolean | (() => boolean)` → `boolean`, `() => boolean`. A fully
 * parenthesized member is unwrapped, and a member with a top-level `=>` is a
 * function type that extends to the end.
 */
export const unionMembers = (type: string): string[] => {
  const members: string[] = [];
  const stack: string[] = [];
  let start = 0;

  for (let i = 0; i < type.length; i++) {
    const char = type.charAt(i);
    const close = closing[char];
    if (char === '"' || char === "'" || char === "`") {
      const end = type.indexOf(char, i + 1);
      i = end === -1 ? type.length : end;
    } else if (char === "=" && type.charAt(i + 1) === ">") {
      if (stack.length === 0) {
        break;
      }
      i++;
    } else if (close !== undefined) {
      stack.push(close);
    } else if (char === stack.at(-1)) {
      stack.pop();
    } else if (char === "|" && stack.length === 0) {
      members.push(type.slice(start, i));
      start = i + 1;
    }
  }
  members.push(type.slice(start));

  return members
    .map((member) => member.trim())
    .filter((member) => member !== "")
    .flatMap((member) =>
      isParenthesized(member) ? unionMembers(member.slice(1, -1)) : [member],
    );
};

const isParenthesized = (member: string): boolean => {
  if (!member.startsWith("(")) {
    return false;
  }
  let depth = 0;
  for (let i = 0; i < member.length; i++) {
    const char = member.charAt(i);
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
      if (depth === 0) {
        return i === member.length - 1;
      }
    }
  }
  return false;
};

/**
 * A prop that takes `boolean`, alone or in a union (`boolean | number`,
 * `boolean | FocusStrategy`) — but not a function returning one.
 */
export const isBoolean = (comp: ComponentDoc, name: string) =>
  !isEvent(name) &&
  !isSlot(comp, name) &&
  unionMembers(comp.props[name]?.type.name ?? "").includes("boolean");

export const isProp = (comp: ComponentDoc, name: string) =>
  !isSlot(comp, name) && !isEvent(name) && !isAttribute(comp, name);

export const isAttribute = (comp: ComponentDoc, name: string) =>
  !isSlot(comp, name) &&
  !isEvent(name) &&
  ["boolean", "string", "number"].includes(comp.props[name]?.type.name ?? "") &&
  // @todo fix attribute problems with camel case and parsing of number/boolean values
  false;
