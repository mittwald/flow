import {
  isEventProp,
  isReactSuspendedStyle,
  isStyleProp,
} from "@/lib/propClassifiers";
import type { RemoteComponentRendererProps } from "@mittwald/remote-dom-react/host";
import { createRemoteComponentRenderer } from "@mittwald/remote-dom-react/host";
import type { EventSerializationMap } from "@mittwald/flow-remote-core";
import {
  mapEventHandler,
  standard as defaultEventSerializer,
} from "@mittwald/flow-remote-core";
import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
import { type ComponentType } from "react";
import { mapValues } from "remeda";
import { useRemoteRendererContext } from "@/context";

const customEventMappings: EventSerializationMap = {
  onPaste: (event: unknown) => {
    const clipEvent = event as ClipboardEvent satisfies ClipboardEvent;

    const eventClipBoardData = clipEvent.clipboardData;
    const windowClipBoardData =
      (window as never) && "clipboardData" in window && window.clipboardData;

    const pastedData: string = (
      eventClipBoardData || windowClipBoardData
    ).getData("text");

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
  function HostComponent(props: P) {
    const hostComponentProps = mapValues(props, (v, k) =>
      mapProperty(v, k),
    ) as P & { [FlowRemoteElement.initializationPropertyName]?: boolean };

    const rendererContext = useRemoteRendererContext();

    const {
      [FlowRemoteElement.initializationPropertyName]: initialized,
      ...restProps
    } = hostComponentProps;

    if (rendererContext === null) {
      return null;
    }

    if (rendererContext.remoteVersion >= 3) {
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
