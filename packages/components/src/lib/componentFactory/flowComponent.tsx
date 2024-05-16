import type {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import type {
  ComponentProps,
  ComponentType,
  ForwardRefExoticComponent,
  LegacyRef,
  PropsWithoutRef,
  RefAttributes,
} from "react";
import React, { forwardRef } from "react";
import type { PropsWithRender, PropsWithTunnel } from "@/lib/types/props";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import { TunnelEntry } from "@mittwald/react-tunnel";

export type FlowComponentProps<C extends FlowComponentName = never> =
  PropsWithTunnel & PropsWithRender<FlowComponentPropsOfName<C>>;

type FlowComponentImplementationProps<C extends FlowComponentName> = Omit<
  FlowComponentPropsOfName<C>,
  keyof FlowComponentProps<C>
> & {
  /** @internal */
  refProp?: LegacyRef<never>;
};

type FlowComponentImplementationType<C extends FlowComponentName> =
  ComponentType<FlowComponentImplementationProps<C>>;

type FlowComponentType<C extends FlowComponentName> = ForwardRefExoticComponent<
  PropsWithoutRef<FlowComponentPropsOfName<C>> & RefAttributes<never>
>;

export function flowComponent<C extends FlowComponentName>(
  componentName: C,
  ImplementationComponentType: FlowComponentImplementationType<C>,
): FlowComponentType<C> {
  return forwardRef<never, FlowComponentPropsOfName<C>>((props, ref) => {
    const { render, tunnelId, ...propsFromContext } = useProps(
      componentName,
      props,
    ) as FlowComponentProps<C>;

    const implementationTypeProps = propsFromContext as ComponentProps<
      typeof ImplementationComponentType
    >;

    const propsWithRef = {
      refProp: ref,
      ...implementationTypeProps,
    };

    let element = <ImplementationComponentType {...propsWithRef} />;

    if (render) {
      const FlowComponent = flowComponent(
        componentName,
        ImplementationComponentType,
      );

      element = (
        <ClearPropsContext>
          {render(
            FlowComponent as unknown as never,
            propsWithRef as unknown as never,
          )}
        </ClearPropsContext>
      );
    }

    if (tunnelId) {
      element = <TunnelEntry id={tunnelId}>{element}</TunnelEntry>;
    }

    return element;
  });
}
