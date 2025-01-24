import { type ComponentType, forwardRef, type PropsWithoutRef } from "react";
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
  Component: ComponentType<P>,
): ComponentType<RemoteComponentRendererProps> => {
  const HostComponentWithRef = forwardRef(function HostComponent(
    props: PropsWithoutRef<P>,
    ref: unknown,
  ) {
    const hostComponentProps = mapValues(props, (v, k) =>
      mapProperty(v, k),
    ) as P;

    return <Component {...hostComponentProps} ref={ref} />;
  });

  return createRemoteComponentRenderer(HostComponentWithRef);
};
