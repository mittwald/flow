import type {
  RemoteComponentRendererProps,
  RemoteTextRendererProps,
} from "@mittwald/remote-dom-react/host";
import { isObjectType, isString } from "remeda";
import { Children, isValidElement, type ReactNode } from "react";

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
