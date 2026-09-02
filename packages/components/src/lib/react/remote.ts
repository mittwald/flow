import type {
  RemoteComponentRendererProps,
  RemoteTextRendererProps,
} from "@mittwald/remote-dom-react/host";
import { isObjectType, isString } from "remeda";
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

/** Whether the node renders text — a string, or its remote counterpart. */
const isTextNode = (child: ReactNode): boolean =>
  typeof child === "string" ||
  (isValidElement(child) && isRemoteTextRenderProps(child.props));

/**
 * `Children.toArray` treats a fragment as a single child, so recurse into one
 * to reach the text a component like `Link` passes down through it.
 */
export const containsTextChild = (children: ReactNode): boolean =>
  Children.toArray(children).some(
    (child) =>
      isTextNode(child) ||
      (isValidElement<PropsWithChildren>(child) &&
        child.type === Fragment &&
        containsTextChild(child.props.children)),
  );

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
