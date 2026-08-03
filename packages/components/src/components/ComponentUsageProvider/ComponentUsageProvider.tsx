import {
  createContext,
  createElement,
  useContext,
  useEffect,
  type ComponentType,
  type FC,
  type PropsWithChildren,
} from "react";

export interface ComponentUsageEvent {
  component: string;
  isInternalComposition: boolean;
}

export type ComponentUsageHandler = (event: ComponentUsageEvent) => void;

export const ComponentUsageContext = createContext<
  ComponentUsageHandler | undefined
>(undefined);

export const internalCompositionProp = "__flowInternalComposition";

interface InternalCompositionProps {
  [internalCompositionProp]?: boolean;
}

export interface ComponentUsageProviderProps extends PropsWithChildren {
  onUsage?: ComponentUsageHandler;
}

export const ComponentUsageProvider: FC<ComponentUsageProviderProps> = (
  props,
) => {
  const { children, onUsage } = props;

  return (
    <ComponentUsageContext.Provider value={onUsage}>
      {children}
    </ComponentUsageContext.Provider>
  );
};

export const markInternalComposition = <P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> => {
  const InternalComposition: FC<P> = (props) =>
    createElement(Component, {
      ...props,
      [internalCompositionProp]: true,
    });

  InternalComposition.displayName = `InternalComposition(${Component.displayName ?? Component.name})`;

  return InternalComposition;
};

export const takeInternalCompositionMark = <P extends object>(
  props: P,
): [isInternalComposition: boolean, restProps: P] => {
  if (!(internalCompositionProp in props)) {
    return [false, props];
  }

  const { [internalCompositionProp]: isInternalComposition, ...restProps } =
    props as P & InternalCompositionProps;

  return [isInternalComposition === true, restProps as unknown as P];
};

export const useReportComponentUsage = (
  component: string,
  isInternalComposition: boolean,
): void => {
  const onUsage = useContext(ComponentUsageContext);

  useEffect(() => {
    onUsage?.({ component, isInternalComposition });
  }, [onUsage, component, isInternalComposition]);
};

export default ComponentUsageProvider;
