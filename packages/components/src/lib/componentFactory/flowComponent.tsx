import type {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import type {
  ComponentProps,
  ComponentType,
  ReactElement,
  ReactNode,
  RefAttributes,
  FunctionComponent,
} from "react";
import { cloneElement } from "react";
import type { PropsWithTunnel } from "@/lib/types/props";
import { TunnelEntry } from "@mittwald/react-tunnel";
import SlotContextProvider from "@/lib/slotContext/SlotContextProvider";
import { useProps } from "@/lib/hooks/useProps";
import { mergeRefs } from "@react-aria/utils";

type RefType<T> = T extends RefAttributes<infer R> ? R : undefined;

export interface FlowComponentProps<R = HTMLDivElement>
  extends PropsWithTunnel,
    RefAttributes<R> {
  wrapWith?: ReactElement;
}

type FlowComponentImplementationProps<C extends FlowComponentName> = Omit<
  FlowComponentPropsOfName<C>,
  keyof FlowComponentProps
> &
  RefAttributes<RefType<FlowComponentPropsOfName<C>>>;

type FlowComponentImplementationType<C extends FlowComponentName> =
  ComponentType<FlowComponentImplementationProps<C>>;

type FlowComponentType<C extends FlowComponentName> = FunctionComponent<
  FlowComponentPropsOfName<C> &
    RefAttributes<RefType<FlowComponentPropsOfName<C>>>
>;

export function flowComponent<C extends FlowComponentName>(
  componentName: C,
  ImplementationComponentType: FlowComponentImplementationType<C>,
): FlowComponentType<C> {
  type Props = FlowComponentPropsOfName<C> &
    RefAttributes<RefType<FlowComponentPropsOfName<C>>>;

  function Component(propsFromArgument: Props) {
    const { ref: refFromProps = null, ...props } = propsFromArgument;

    const {
      ref: refFromContext = null,
      tunnelId,
      wrapWith,
      ...propsWithContext
    } = useProps(
      componentName,
      props as FlowComponentPropsOfName<C>,
    ) as FlowComponentProps<RefType<FlowComponentPropsOfName<C>>>;

    const implementationTypeProps = propsWithContext as ComponentProps<
      typeof ImplementationComponentType
    >;

    const mergedRef = mergeRefs(refFromProps, refFromContext);
    const propsWithRef = {
      ...implementationTypeProps,
      ref: mergedRef,
    };

    ImplementationComponentType.displayName = `FlowComponentImpl(${componentName})`;

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
  }

  Component.displayName = `FlowComponent(${componentName})`;
  return Component;
}
