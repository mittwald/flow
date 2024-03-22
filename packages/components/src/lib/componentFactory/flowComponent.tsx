import {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import React, { ComponentType } from "react";
import { PropsWithTunnel } from "@/lib/types/props";
import { useProps } from "@/lib/propsContext";
import { TunnelEntry } from "@mittwald/react-tunnel";

type FlowComponentImplementationType<C extends FlowComponentName> =
  ComponentType<Omit<FlowComponentPropsOfName<C>, "tunnelId">>;

type FlowComponentType<C extends FlowComponentName> = ComponentType<
  FlowComponentPropsOfName<C> & PropsWithTunnel
>;

export type FlowComponentProps<P = unknown> = P & PropsWithTunnel;

export function flowComponent<C extends FlowComponentName>(
  componentName: C,
  ComponentType: FlowComponentImplementationType<C>,
): FlowComponentType<C> {
  return function FlowComponent(p) {
    const props = useProps(componentName, p);

    if ("tunnelId" in props) {
      const { tunnelId, ...rest } = props;
      return (
        <TunnelEntry id={tunnelId}>
          <ComponentType {...rest} />
        </TunnelEntry>
      );
    }

    return <ComponentType {...props} />;
  };
}
