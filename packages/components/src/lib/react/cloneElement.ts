import { isRemoteComponentRendererProps } from "@/lib/react/remote";
import type { Attributes, ReactElement } from "react";
import React from "react";

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
