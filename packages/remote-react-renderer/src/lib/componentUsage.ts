import type { FlowComponentStatus } from "@mittwald/flow-react-components/internal";
import type { ComponentRenderedEvent } from "@mittwald/flow-remote-core";

/**
 * A Flow component an extension used, as reported by the remote. Renders that
 * arrive through a Flow view are composition rather than usage and are not
 * reported at all.
 */
export interface ComponentUsageEvent {
  /** Display name of the used Flow component, e.g. `"Button"`. */
  component: string;
  /**
   * The component's lifecycle status (ADR 0003) from the generated status
   * registry. `undefined` for components the registry does not track as an
   * independent contract unit — subcomponents like `TableCell` or `XAxis`.
   */
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
