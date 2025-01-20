import type { ComponentType, PropsWithoutRef } from "react";
import { createElement, forwardRef } from "react";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";
import { createRemoteComponentRenderer } from "@remote-dom/react/host";
import { mapValues } from "remeda";
import { mapEventHandler } from "@mittwald/flow-remote-core";
import {
  isEventProp,
  isReactSuspendedStyle,
  isStyleProp,
} from "~/lib/propClassifiers";

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
  component: ComponentType<P>,
): ComponentType<RemoteComponentRendererProps> => {
  const HostComponentWithRef = forwardRef(function HostComponent(
    props: PropsWithoutRef<P>,
    ref: unknown,
  ) {
    const hostComponentProps = mapValues(props, (v, k) => mapProperty(v, k));

    return createElement(component, {
      ...hostComponentProps,
      ref,
    } as unknown as P);
  });

  return createRemoteComponentRenderer(HostComponentWithRef);
};
