import {
  isEventProp,
  isReactSuspendedStyle,
  isStyleProp,
} from "@/lib/propClassifiers";
import type { RemoteComponentRendererProps } from "@mittwald/remote-dom-react/host";
import { createRemoteComponentRenderer } from "@mittwald/remote-dom-react/host";
import { mapEventHandler, Version } from "@mittwald/flow-remote-core";
import {
  FlowRemoteElement,
  type FlowRemoteElementMetaData,
} from "@mittwald/flow-remote-elements";
import { type ComponentType } from "react";
import { mapValues } from "remeda";

const mapProperty = (val: unknown, key: string) => {
  if (isEventProp(key, val)) {
    return mapEventHandler(val, key);
  }
  if (isStyleProp(key)) {
    if (isReactSuspendedStyle(val)) {
      return {
        display: "none",
      };
    }
    return {};
  }
  return val;
};

export const createFlowRemoteComponentRenderer = <P extends object>(
  name: string,
  Component: ComponentType<P>,
): ComponentType<RemoteComponentRendererProps> => {
  function HostComponent(props: P & FlowRemoteElementMetaData) {
    const hostComponentProps = mapValues(props, (v, k) =>
      mapProperty(v, k),
    ) as P & FlowRemoteElementMetaData;

    const {
      [FlowRemoteElement.versionPropertyName]: version = Version.v1,
      [FlowRemoteElement.initializationPropertyName]: initialized = false,
      ...restProps
    } = hostComponentProps;

    if (version >= Version.v3) {
      // "initialized" handling introduced in version 3
      if (!initialized) {
        return null;
      }
    }

    return <Component {...(restProps as P)} />;
  }
  HostComponent.displayName = `FlowRemoteRenderer(${name})`;
  return createRemoteComponentRenderer(HostComponent, {
    name: `RemoteRenderer(${name})`,
  });
};
