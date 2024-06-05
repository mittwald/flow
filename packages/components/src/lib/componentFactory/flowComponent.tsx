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
  ReactNode,
  RefAttributes,
} from "react";
import React, { forwardRef, useCallback } from "react";
import type { PropsWithRender, PropsWithTunnel } from "@/lib/types/props";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import { TunnelEntry } from "@mittwald/react-tunnel";
import { ComponentRenderContextProvider } from "@/lib/propsContext/render/ComponentRenderContextProvider";
import { useComponentRenderFn } from "@/lib/propsContext/render/useComponentRenderFn";

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
    const {
      render: ignoredRender,
      tunnelId,
      ...propsWithContext
    } = useProps(componentName, props) as FlowComponentProps<C>;

    const [renderFn, renderContext] = useComponentRenderFn(componentName);

    const FlowRenderComponent = useCallback(
      flowComponent(componentName, ImplementationComponentType),
      [componentName, ImplementationComponentType],
    );

    const implementationTypeProps = propsWithContext as ComponentProps<
      typeof ImplementationComponentType
    >;

    const propsWithRef = {
      refProp: ref,
      ...implementationTypeProps,
    };

    let element: ReactNode = <ImplementationComponentType {...propsWithRef} />;

    if (renderFn) {
      element = (
        <ClearPropsContext>
          <ComponentRenderContextProvider value={renderContext}>
            {renderFn(FlowRenderComponent as never, propsWithRef as never)}
          </ComponentRenderContextProvider>
        </ClearPropsContext>
      );
    }

    if (tunnelId) {
      element = <TunnelEntry id={tunnelId}>{element}</TunnelEntry>;
    }

    return element;
  });
}
