import type {
  FlowComponentName,
  FlowComponentProps as FlowComponentPropsOfName,
} from "@/components/propTypes";
import type {
  ComponentProps,
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
  RefAttributes,
} from "react";
import { cloneElement, memo } from "react";
import type { PropsWithTunnel } from "@/lib/types/props";
import { TunnelEntry } from "@mittwald/react-tunnel";
import SlotContextProvider from "@/lib/slotContext/SlotContextProvider";
import { useProps } from "@/lib/hooks/useProps";
import { useComponentPropsContext } from "@/lib/propsContext/propsContext";
import { ComponentPropsContextProvider } from "@/components/ComponentPropsContextProvider";
import { ClearPropsContext } from "@/components/ClearPropsContext";
import ClearPropsContextView from "@/views/ClearPropsContextView";

type RefType<T> = T extends RefAttributes<infer R> ? R : undefined;

export interface FlowComponentProps<R = HTMLDivElement>
  extends PropsWithTunnel, RefAttributes<R> {
  wrapWith?: ReactElement;
}

export type FlowComponentImplementationProps<C extends FlowComponentName> =
  Omit<FlowComponentPropsOfName<C>, keyof FlowComponentProps> &
    RefAttributes<RefType<FlowComponentPropsOfName<C>>>;

type FlowComponentImplementationType<C extends FlowComponentName> =
  ComponentType<FlowComponentImplementationProps<C>>;

type FlowComponentType<C extends FlowComponentName> = FunctionComponent<
  FlowComponentPropsOfName<C> &
    RefAttributes<RefType<FlowComponentPropsOfName<C>>>
>;

export type FlowComponentProvisionType = "provider" | "ui" | "layout";

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

    ImplementationComponentType.displayName = `FlowComponentImpl(${componentName})`;

    let element: ReactNode = (
      <MemoizedImplementationComponentType {...implementationTypeProps} />
    );

    element = (
      <ComponentPropsContextProvider componentProps={componentProps}>
        {element}
      </ComponentPropsContextProvider>
    );

    if (type === "ui") {
      /**
       * Protect the inside of UI components for accidental prop changes through
       * the Props Context.
       */
      if (isRemoteComponent) {
        element = <ClearPropsContext>{element}</ClearPropsContext>;
      } else {
        /**
         * In case of a UI component that does not have a remote counterpart
         * (like the Modal component), the <ClearPropsContext> must be
         * additionally applied on the host side by using the
         * <ClearPropsContextView>.
         *
         * This prevents Props Contexts created by parent components on the host
         * side affecting the children of this UI component.
         */
        element = (
          <ClearPropsContext>
            <ClearPropsContextView>{element}</ClearPropsContextView>
          </ClearPropsContext>
        );
      }
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
