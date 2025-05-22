import {
  isEventProp,
  isReactSuspendedStyle,
  isStyleProp,
} from "@/lib/propClassifiers";
import type { RemoteComponentRendererProps } from "@mittwald/remote-dom-react/host";
import { createRemoteComponentRenderer } from "@mittwald/remote-dom-react/host";
import { mapEventHandler } from "@mittwald/flow-remote-core";
import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
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
  function HostComponent(props: P) {
    const hostComponentProps = mapValues(props, (v, k) =>
      mapProperty(v, k),
    ) as P & { [FlowRemoteElement.initializationPropertyName]?: boolean };

    const {
      [FlowRemoteElement.initializationPropertyName]: initialized,
      ...restProps
    } = hostComponentProps;

    if (!initialized) {
      return null;
    }

    return <Component {...(restProps as P)} />;
  }
  HostComponent.displayName = `FlowRemoteRenderer(${name})`;
  return createRemoteComponentRenderer(HostComponent, {
    name: `RemoteRenderer(${name})`,
  });
};
