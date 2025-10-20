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
import { cloneElement, memo, useMemo } from "react";
import type { PropsWithTunnel } from "@/lib/types/props";
import { TunnelEntry } from "@mittwald/react-tunnel";
import SlotContextProvider from "@/lib/slotContext/SlotContextProvider";
import { useProps } from "@/lib/hooks/useProps";
import { useComponentPropsContext } from "@/lib/propsContext/propsContext";
import { increaseNestingLevel } from "@/lib/propsContext/nestedPropsContext/lib";
import { ComponentPropsContextProvider } from "@/components/ComponentPropsContextProvider";
import type { PropsContextLevelMode } from "@/lib/propsContext/inherit/types";
import ComponentPropsContextProviderView from "@/views/ComponentPropsContextProviderView";

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

type FlowComponentProvisionType = "provider" | "ui";

interface Options {
  type?: FlowComponentProvisionType;
  isRemoteComponent?: boolean;
}

export function flowComponent<C extends FlowComponentName>(
  componentName: C,
  ImplementationComponentType: FlowComponentImplementationType<C>,
  options: Options = {},
): FlowComponentType<C> {
  type Props = FlowComponentPropsOfName<C> &
    RefAttributes<RefType<FlowComponentPropsOfName<C>>>;

  const { type = "ui", isRemoteComponent = false } = options;

  const propsContextLevelMode: PropsContextLevelMode =
    type === "ui" ? "increment" : "keep";

  const MemoizedImplementationComponentType = memo(ImplementationComponentType);

  function Component(props: Props) {
    const { tunnelId, wrapWith, ...propsWithContext } = useProps(
      componentName,
      props as FlowComponentPropsOfName<C>,
    ) as FlowComponentProps<RefType<FlowComponentPropsOfName<C>>>;

    const implementationTypeProps = propsWithContext as ComponentProps<
      typeof ImplementationComponentType
    >;

    const componentProps = useComponentPropsContext(componentName);
    const componentPropsToUse = useMemo(
      () => increaseNestingLevel(componentProps ?? {}),
      [componentProps],
    );

    ImplementationComponentType.displayName = `FlowComponentImpl(${componentName})`;

    let element: ReactNode = (
      <MemoizedImplementationComponentType {...implementationTypeProps} />
    );

    if (isRemoteComponent) {
      element = (
        <ComponentPropsContextProvider
          componentProps={componentPropsToUse}
          levelModel={propsContextLevelMode}
        >
          {element}
        </ComponentPropsContextProvider>
      );
    } else {
      /**
       * In case of a Flow component that does not have a remote counterpart
       * (like the List component), the ComponentPropsContext must be applied on
       * the host side, so that nesting and inheritance is working correctly.
       */
      element = (
        <ComponentPropsContextProviderView
          componentProps={componentPropsToUse}
          levelModel={propsContextLevelMode}
        >
          {element}
        </ComponentPropsContextProviderView>
      );
    }

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
  return memo(Component);
}
