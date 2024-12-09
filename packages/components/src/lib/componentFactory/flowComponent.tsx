import type {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import type {
  ComponentProps,
  ComponentType,
  ForwardRefExoticComponent,
  Ref,
  PropsWithoutRef,
  ReactElement,
  ReactNode,
  RefAttributes,
} from "react";
import { cloneElement } from "react";
import React, { forwardRef } from "react";
import type { PropsWithTunnel } from "@/lib/types/props";
import { useProps } from "@/lib/propsContext";
import { TunnelEntry } from "@mittwald/react-tunnel";
import SlotContextProvider from "@/lib/slotContext/SlotContextProvider";

export interface FlowComponentProps extends PropsWithTunnel {
  wrapWith?: ReactElement;
}

type FlowComponentImplementationProps<C extends FlowComponentName, R> = Omit<
  FlowComponentPropsOfName<C>,
  keyof FlowComponentProps
> & {
  /** @internal */
  refProp?: Ref<R>;
};

type FlowComponentImplementationType<
  C extends FlowComponentName,
  R = never,
> = ComponentType<FlowComponentImplementationProps<C, R>>;

type FlowComponentType<
  C extends FlowComponentName,
  R,
> = ForwardRefExoticComponent<
  PropsWithoutRef<FlowComponentPropsOfName<C>> & RefAttributes<R>
>;

export function flowComponent<C extends FlowComponentName, R = never>(
  componentName: C,
  ImplementationComponentType: FlowComponentImplementationType<C, R>,
): FlowComponentType<C, R> {
  return forwardRef<R, FlowComponentPropsOfName<C>>((props, ref) => {
    const { tunnelId, wrapWith, ...propsWithContext } = useProps(
      componentName,
      props as FlowComponentPropsOfName<C>,
    ) as FlowComponentProps;

    const implementationTypeProps = propsWithContext as ComponentProps<
      typeof ImplementationComponentType
    >;

    const propsWithRef = {
      refProp: ref,
      ...implementationTypeProps,
    };

    let element: ReactNode = <ImplementationComponentType {...propsWithRef} />;

    if ("slot" in props && !!props.slot) {
      element = (
        <SlotContextProvider slot={props.slot} component={componentName}>
          {element}
        </SlotContextProvider>
      );
    }

    if (wrapWith) {
      element = cloneElement(wrapWith, undefined, element);
    }

    if (tunnelId) {
      element = <TunnelEntry id={tunnelId}>{element}</TunnelEntry>;
    }

    return element;
  });
}
