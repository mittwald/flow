import type { Attributes, ReactElement, ReactNode } from "react";
import React from "react";
import { deepMap } from "react-children-utilities";

export const cloneElement = <P>(
  element: ReactElement<P>,
  props?: Partial<P> & Attributes,
  ...children: ReactNode[]
) =>
  deepMap(element, (child: ReactNode, index) => {
    if (
      index === 0 &&
      React.isValidElement<{
        element: { properties: P };
      }>(child) &&
      "element" in child.props &&
      "receiver" in child.props &&
      "properties" in child.props.element
    ) {
      child.props.element.properties = {
        ...props,
        ...child.props.element.properties,
      };
    } else if (
      (index === undefined || index === 0) &&
      React.isValidElement<P>(child)
    ) {
      if (children.length >= 1) {
        return React.cloneElement<P>(child, props, children);
      }

      return React.cloneElement<P>(child, props);
    }

    return child;
  });
