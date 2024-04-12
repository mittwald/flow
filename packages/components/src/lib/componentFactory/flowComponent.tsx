import type {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import type {
  ComponentType,
  ForwardRefExoticComponent,
  LegacyRef,
  PropsWithoutRef,
  RefAttributes,
} from "react";
import React, { forwardRef } from "react";
import type { PropsWithHOC, PropsWithTunnel } from "@/lib/types/props";
import { useProps } from "@/lib/propsContext";
import { TunnelEntry } from "@mittwald/react-tunnel";

export type FlowComponentProps<P = unknown> = P &
  PropsWithTunnel &
  PropsWithHOC<P>;

type FlowComponentImplementationType<C extends FlowComponentName> =
  ComponentType<
    Omit<FlowComponentPropsOfName<C>, keyof FlowComponentProps> & {
      ref?: LegacyRef<never>;
    }
  >;

type FlowComponentType<C extends FlowComponentName> = ForwardRefExoticComponent<
  PropsWithoutRef<FlowComponentPropsOfName<C>> & RefAttributes<never>
>;

export function flowComponent<C extends FlowComponentName>(
  componentName: C,
  ImplementationComponentType: FlowComponentImplementationType<C>,
): FlowComponentType<C> {
  return forwardRef<never, FlowComponentPropsOfName<C>>((p, ref) => {
    const { tunnelId, hoc, ...rest } = useProps(
      componentName,
      p,
    ) as FlowComponentProps<FlowComponentPropsOfName<C>>;

    let element = <ImplementationComponentType {...rest} ref={ref} />;

    if (hoc) {
      element = hoc(element, p);
    }

    if (tunnelId) {
      element = <TunnelEntry id={tunnelId}>{element}</TunnelEntry>;
    }

    return element;
  });
}
