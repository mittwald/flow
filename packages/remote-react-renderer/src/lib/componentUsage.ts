import type { FlowComponentStatus } from "@mittwald/flow-react-components/internal";
import type { ComponentRenderedEvent } from "@mittwald/flow-remote-core";

export interface ComponentUsageEvent {
  component: string;
  isInternalComposition: boolean;
  status?: FlowComponentStatus;
}

export type ComponentUsageHandler = (event: ComponentUsageEvent) => void;

export type ComponentStatusResolver = (
  component: string,
) => FlowComponentStatus | undefined;

export const toComponentUsageEvent = (
  event: ComponentRenderedEvent,
  resolveStatus: ComponentStatusResolver,
): ComponentUsageEvent => ({
  ...event.data,
  status: resolveStatus(event.data.component),
});
