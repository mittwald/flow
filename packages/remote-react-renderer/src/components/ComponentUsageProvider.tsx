"use client";
import {
  createComponentUsageCollector,
  type ComponentUsageCollector,
  type ComponentUsageHandler,
} from "@/lib/componentUsage";
import { getFlowComponentStatus } from "@mittwald/flow-react-components/internal";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type FC,
  type PropsWithChildren,
} from "react";

export const ComponentUsageContext = createContext<
  ComponentUsageCollector | undefined
>(undefined);

export interface ComponentUsageProviderProps extends PropsWithChildren {
  onUsage?: ComponentUsageHandler;
}

export const ComponentUsageProvider: FC<ComponentUsageProviderProps> = (
  props,
) => {
  const { onUsage, children } = props;

  const handler = useRef(onUsage);
  handler.current = onUsage;

  const collector = useMemo(
    () =>
      createComponentUsageCollector(
        (event) => handler.current?.(event),
        getFlowComponentStatus,
      ),
    [],
  );

  return (
    <ComponentUsageContext.Provider value={onUsage ? collector : undefined}>
      {children}
    </ComponentUsageContext.Provider>
  );
};

export const useReportComponentUsage = (component: string): void => {
  const collector = useContext(ComponentUsageContext);

  useEffect(() => {
    collector?.report(component);
  }, [collector, component]);
};

export default ComponentUsageProvider;
