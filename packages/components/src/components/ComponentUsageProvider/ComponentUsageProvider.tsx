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
}

export type ComponentUsageHandler = (event: ComponentUsageEvent) => void;

const componentUsageContext = createContext<ComponentUsageHandler | undefined>(
  undefined,
);

const viewCompositionContext = createContext(false);

export interface ComponentUsageProviderProps extends PropsWithChildren {
  onUsage?: ComponentUsageHandler;
}

export const ComponentUsageProvider: FC<ComponentUsageProviderProps> = (
  props,
) => {
  const { children, onUsage } = props;

  return (
    <componentUsageContext.Provider value={onUsage}>
      {children}
    </componentUsageContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markedComponents = new WeakMap<ComponentType<any>, ComponentType<any>>();

const markViewComposition = <P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> => {
  const cached = markedComponents.get(Component);
  if (cached) {
    return cached as ComponentType<P>;
  }

  const ViewComposition: FC<P> = (props) => (
    <viewCompositionContext.Provider value={true}>
      {createElement(Component, props)}
    </viewCompositionContext.Provider>
  );

  ViewComposition.displayName = `ViewComposition(${Component.displayName ?? Component.name})`;

  markedComponents.set(Component, ViewComposition);

  return ViewComposition;
};

export const markViewComponents = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, ComponentType<any>>,
>(
  components: T,
): T =>
  Object.fromEntries(
    Object.entries(components).map(([name, component]) => [
      name,
      markViewComposition(component),
    ]),
    // Same keys, same props — only the render is wrapped.
  ) as T;

export const ViewCompositionReset: FC<PropsWithChildren> = ({ children }) => (
  <viewCompositionContext.Provider value={false}>
    {children}
  </viewCompositionContext.Provider>
);

export const useReportComponentUsage = (component: string): boolean => {
  const onUsage = useContext(componentUsageContext);
  const isViewComposition = useContext(viewCompositionContext);

  useEffect(() => {
    if (!isViewComposition) {
      onUsage?.({ component });
    }
  }, [onUsage, component, isViewComposition]);

  return isViewComposition;
};

export default ComponentUsageProvider;
