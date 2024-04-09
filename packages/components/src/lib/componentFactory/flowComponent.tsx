import type {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import type { ComponentType } from "react";
import React from "react";
import type { PropsWithHOC, PropsWithTunnel } from "@/lib/types/props";
import { useProps } from "@/lib/propsContext";
import { TunnelEntry } from "@mittwald/react-tunnel";

export type FlowComponentProps<P = unknown> = P &
  PropsWithTunnel &
  PropsWithHOC<P>;

type FlowComponentImplementationType<C extends FlowComponentName> =
  ComponentType<Omit<FlowComponentPropsOfName<C>, keyof FlowComponentProps>>;

type FlowComponentType<C extends FlowComponentName> = ComponentType<
  FlowComponentPropsOfName<C>
>;

export function flowComponent<C extends FlowComponentName>(
  componentName: C,
  ComponentType: FlowComponentImplementationType<C>,
): FlowComponentType<C> {
  return function FlowComponent(p) {
    const { tunnelId, hoc, ...rest } = useProps(
      componentName,
      p,
    ) as FlowComponentProps<FlowComponentPropsOfName<C>>;

    let element = <ComponentType {...rest} />;

    if (hoc) {
      element = hoc(element, p);
    }

    if (tunnelId) {
      element = <TunnelEntry id={tunnelId}>{element}</TunnelEntry>;
    }

    return element;
  };
}
