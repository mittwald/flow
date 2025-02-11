import type {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import type {
  ComponentProps,
  ComponentType,
  Ref,
  ReactElement,
  ReactNode,
  RefAttributes,
  FunctionComponent,
} from "react";
import { cloneElement } from "react";
import React from "react";
import type { PropsWithTunnel } from "@/lib/types/props";
import { TunnelEntry } from "@mittwald/react-tunnel";
import SlotContextProvider from "@/lib/slotContext/SlotContextProvider";
import { useProps } from "@/lib/hooks/useProps";

export interface FlowComponentProps extends PropsWithTunnel {
  wrapWith?: ReactElement;
}

type FlowComponentImplementationProps<C extends FlowComponentName, R> = Omit<
  FlowComponentPropsOfName<C>,
  keyof FlowComponentProps
> & {
  /** @internal */
  ref?: Ref<R>;
};

type FlowComponentImplementationType<
  C extends FlowComponentName,
  R = never,
> = ComponentType<FlowComponentImplementationProps<C, R>>;

type FlowComponentType<C extends FlowComponentName, R> = FunctionComponent<
  FlowComponentPropsOfName<C> & RefAttributes<R>
>;

export function flowComponent<C extends FlowComponentName, R = HTMLDivElement>(
  componentName: C,
  ImplementationComponentType: FlowComponentImplementationType<C, R>,
): FlowComponentType<C, R> {
  return (propsFromArgument) => {
    const { ref, ...props } = propsFromArgument;

    const { tunnelId, wrapWith, ...propsWithContext } = useProps(
      componentName,
      props as FlowComponentPropsOfName<C>,
    ) as FlowComponentProps;

    const implementationTypeProps = propsWithContext as ComponentProps<
      typeof ImplementationComponentType
    >;

    const propsWithRef = {
      ...implementationTypeProps,
      ref,
    };

    let element: ReactNode = <ImplementationComponentType {...propsWithRef} />;

    if ("slot" in props && !!props.slot && typeof props.slot === "string") {
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
  };
}
