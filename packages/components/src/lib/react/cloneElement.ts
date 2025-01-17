import type { Attributes, ReactElement } from "react";
import React from "react";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";

function isRemoteComponentRendererProps(
  props: unknown,
): props is RemoteComponentRendererProps {
  return (
    typeof props === "object" &&
    props !== null &&
    "element" in props &&
    "components" in props &&
    "receiver" in props
  );
}

export const cloneElement = <P>(
  element: ReactElement<P>,
  props?: Partial<P> & Attributes,
) => {
  const existingProps = element.props;
  if (isRemoteComponentRendererProps(existingProps)) {
    Object.assign(existingProps.element.properties, props);
  }
  return React.cloneElement(element, props);
};
