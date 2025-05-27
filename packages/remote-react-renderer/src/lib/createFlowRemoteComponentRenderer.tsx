import {
  isEventProp,
  isReactSuspendedStyle,
  isStyleProp,
} from "@/lib/propClassifiers";
import type { RemoteComponentRendererProps } from "@mittwald/remote-dom-react/host";
import { createRemoteComponentRenderer } from "@mittwald/remote-dom-react/host";
import type { EventSerializationMap } from "@mittwald/flow-remote-core";
import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
import type { FlowRemoteElementMetaData } from "@mittwald/flow-remote-elements";
import {
  mapEventHandler,
  Version,
  standard as defaultEventSerializer,
} from "@mittwald/flow-remote-core";
import { type ComponentType } from "react";
import { mapValues } from "remeda";

const customEventMappings: EventSerializationMap = {
  onPaste: (event: unknown) => {
    const clipEvent = event as ClipboardEvent satisfies ClipboardEvent;
    const pastedData: string = clipEvent.clipboardData?.getData("text") ?? "";

    return {
      ...(defaultEventSerializer(event) as object),
      content: pastedData,
    };
  },
};

const mapProperty = (val: unknown, key: string) => {
  if (isEventProp(key, val)) {
    return mapEventHandler(val, key, customEventMappings);
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
