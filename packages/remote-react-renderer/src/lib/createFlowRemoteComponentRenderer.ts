import type { ComponentType, PropsWithoutRef, PropsWithRef } from "react";
import { createElement, forwardRef } from "react";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";
import { createRemoteComponentRenderer } from "@remote-dom/react/host";
import { mapValues } from "remeda";

type EventHandler = (event: unknown) => void;

const mapEventHandler =
  (eventHandler: EventHandler) => (ignoredEvent: object) => {
    const { target: ignoredTarget, src: ignoredSrc, ...rest } = ignoredEvent;
    return eventHandler(rest);
  };

export const defaultEventPropMatcher = /on[A-Z].*/;

const mapProperty =
  (eventPropMatchers: EventPropMatcher[]) => (val: unknown, key: string) => {
    if (
      eventPropMatchers.some(
        (m) => (typeof m === "string" && key === m) || key.match(m),
      ) &&
      typeof val === "function"
    ) {
      return mapEventHandler(val as EventHandler);
    }
    return val;
  };

type EventPropMatcher = string | RegExp;

interface Opts {
  eventPropMatchers?: EventPropMatcher[];
}

export const createFlowRemoteComponentRenderer = <
  P extends Record<string, unknown>,
>(
  component: ComponentType<P>,
  opts: Opts = {},
): ComponentType<PropsWithRef<RemoteComponentRendererProps>> => {
  const { eventPropMatchers = [defaultEventPropMatcher] } = opts;
  const HostComponentWithRef = forwardRef(function HostComponent(
    props: PropsWithoutRef<P>,
    ref: unknown,
  ) {
    const hostComponentProps = mapValues(props, mapProperty(eventPropMatchers));
    return createElement(component, {
      ...hostComponentProps,
      refProp: ref,
    } as unknown as P);
  });

  return createRemoteComponentRenderer(HostComponentWithRef);
};
