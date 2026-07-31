import type { FlowComponentStatus } from "@mittwald/flow-react-components/internal";

export interface ComponentUsageEvent {
  component: string;
  status?: FlowComponentStatus;
}

export type ComponentUsageHandler = (event: ComponentUsageEvent) => void;

export type ComponentStatusResolver = (
  component: string,
) => FlowComponentStatus | undefined;

export interface ComponentUsageCollector {
  report: (component: string) => void;
}

export const createComponentUsageCollector = (
  handler: ComponentUsageHandler,
  resolveStatus: ComponentStatusResolver,
): ComponentUsageCollector => {
  const reported = new Set<string>();

  return {
    report: (component) => {
      if (reported.has(component)) {
        return;
      }
      reported.add(component);
      handler({ component, status: resolveStatus(component) });
    },
  };
};
