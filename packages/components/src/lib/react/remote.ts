import type {
  RemoteComponentRendererProps,
  RemoteTextRendererProps,
} from "@mittwald/remote-dom-react/host";
import { isNumber, isObjectType, isString } from "remeda";
import {
  Children,
  Fragment,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
} from "react";

export function isRemoteComponentRendererProps(
  props: unknown,
): props is RemoteComponentRendererProps {
  return (
    isObjectType(props) &&
    "element" in props &&
    "components" in props &&
    "receiver" in props
  );
}

/**
 * The text `children` are _themselves_ — plain strings and numbers locally,
 * `RemoteTextRenderer` elements remotely — joined and trimmed. `undefined` when
 * there is none.
 *
 * Text inside an element child is deliberately left out, because it belongs to
 * that element rather than to the component being described:
 * `<Option>Millennium Falcon <Badge>Latest</Badge></Option>` is the option
 * "Millennium Falcon", not "Millennium Falcon Latest". A fragment is grouping
 * rather than rendered output, so this looks through it.
 *
 * Use this over {@link extractTextFromFirstChild} when the question is "what
 * does this read as", not "are the children one single text node".
 */
export const extractTextFromChildren = (
  children: ReactNode,
): string | undefined => {
  const text = joinTextChildren(children).trim();

  return text === "" ? undefined : text;
};

const joinTextChildren = (children: ReactNode): string =>
  Children.toArray(children)
    .map((child) => {
      if (isString(child) || isNumber(child)) {
        return String(child);
      }

      if (!isValidElement(child)) {
        return "";
      }

      if (isRemoteTextRenderProps(child.props)) {
        return child.props.remote.data;
      }

      return child.type === Fragment
        ? joinTextChildren((child.props as PropsWithChildren).children)
        : "";
    })
    .join("");

/**
 * The text of `children` when they are exactly one text node — locally a
 * string, remotely a `RemoteTextRenderer` element. `undefined` for anything
 * else, including a single string next to anything at all.
 *
 * That strictness is the point for its callers: `Button` decides its icon-only
 * layout by it, `Markdown` takes it as the markdown source, and `Initials` and
 * `Truncate` operate on the whole content. For "what does this read as", use
 * {@link extractTextFromChildren}.
 */
export const extractTextFromFirstChild = (children: ReactNode) => {
  if (Children.count(children) !== 1) {
    return undefined;
  }

  const firstChild = Children.toArray(children)[0];

  return typeof firstChild === "string"
    ? firstChild
    : isValidElement(firstChild) && isRemoteTextRenderProps(firstChild.props)
      ? firstChild.props.remote.data
      : undefined;
};

export function isRemoteTextRenderProps(
  props: unknown,
): props is RemoteTextRendererProps {
  return (
    isObjectType(props) &&
    "remote" in props &&
    isObjectType(props.remote) &&
    "data" in props.remote &&
    isString(props.remote.data)
  );
}
