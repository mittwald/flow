import type { ComponentType, PropsWithoutRef, PropsWithRef } from "react";
import { forwardRef } from "react";
import { createElement } from "react";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";
import { createRemoteComponentRenderer } from "@remote-dom/react/host";
import { mapValues } from "remeda";

type EventHandler = (event: unknown) => void;

const mapEventHandler =
  (eventHandler: EventHandler) => (ignoredEvent: unknown) => {
    return eventHandler(undefined);
  };

const mapProperty = (val: unknown, key: string) => {
  if (key.match(/on[A-Z].*/) && typeof val === "function") {
    return mapEventHandler(val as EventHandler);
  }
  return val;
};

export const createFlowRemoteComponentsRenderer = <
  P extends Record<string, unknown>,
>(
  component: ComponentType<P>,
): ComponentType<PropsWithRef<RemoteComponentRendererProps>> => {
  const HostComponentWithRef = forwardRef(function HostComponent(
    props: PropsWithoutRef<P>,
    ref: unknown,
  ) {
    const hostComponentProps = mapValues(props, mapProperty);
    return createElement(component, {
      ...hostComponentProps,
      refProp: ref,
    } as unknown as P);
  });

  return createRemoteComponentRenderer(HostComponentWithRef);
};
