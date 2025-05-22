import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
import { createRemoteComponent as libCreateRemoteComponent } from "@mittwald/remote-dom-react";
import { createElement } from "react";

export const createRemoteComponent: typeof libCreateRemoteComponent = (
  name,
  element,
  options,
) => {
  const RemoteComponent = libCreateRemoteComponent(name, element, options);
  return (props) =>
    createElement(RemoteComponent, {
      ...props,
      [FlowRemoteElement.initializationPropertyName]: true,
    });
};
