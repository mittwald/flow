import type { ComponentType, PropsWithoutRef } from "react";
import { createElement, forwardRef } from "react";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";
import { createRemoteComponentRenderer } from "@remote-dom/react/host";
import { isFunction, mapValues } from "remeda";
import type {
  EventSerializationMap,
  EventHandler,
} from "@mittwald/flow-remote-core";
import { mapEventHandler } from "@mittwald/flow-remote-core";

export const defaultEventPropMatcher = /on[A-Z].*/;

const mapProperty = (val: unknown, key: string, init: InitObject) => {
  if (key.match(defaultEventPropMatcher) && isFunction(val)) {
    return mapEventHandler(val as EventHandler, key, init.eventSerialization);
  }
  return val;
};

interface InitObject {
  eventSerialization?: EventSerializationMap;
}

export const createFlowRemoteComponentRenderer = <
  P extends Record<string, unknown>,
>(
  component: ComponentType<P>,
  init: InitObject = {},
): ComponentType<RemoteComponentRendererProps> => {
  const HostComponentWithRef = forwardRef(function HostComponent(
    props: PropsWithoutRef<P>,
    ref: unknown,
  ) {
    const hostComponentProps = mapValues(props, (v, k) =>
      mapProperty(v, k, init),
    );

    return createElement(component, {
      ...hostComponentProps,
      ref,
    } as unknown as P);
  });

  return createRemoteComponentRenderer(HostComponentWithRef);
};
