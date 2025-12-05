import { version } from "@/version";
import { useControlledRemoteValueProps } from "@mittwald/flow-react-components";
import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
import { createRemoteComponent as libCreateRemoteComponent } from "@mittwald/remote-dom-react";
import { createElement } from "react";

const controlledComponentNames: (keyof HTMLElementTagNameMap)[] = [
  "flr-markdown-editor",
  "flr-number-field",
  "flr-password-creation-field",
  "flr-search-field",
  "flr-text-field",
  "flr-text-area",
];

export const createRemoteComponent: typeof libCreateRemoteComponent = (
  name,
  element,
  options,
) => {
  const RemoteComponent = libCreateRemoteComponent(name, element, options);
  return (props) => {
    const isControlledComponent = controlledComponentNames.includes(
      name as keyof HTMLElementTagNameMap,
    );

    return createElement(RemoteComponent, {
      [FlowRemoteElement.initializationPropertyName]: true,
      [FlowRemoteElement.versionPropertyName]: version,
      ...(isControlledComponent ? useControlledRemoteValueProps(props) : props),
    });
  };
};
