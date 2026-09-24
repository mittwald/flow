import {
  ActionState as ActionStateBase,
  actionStateDurations,
} from "@mittwald/flow-components-base";
import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";

export type { ActionStateValue } from "@mittwald/flow-components-base";

export const duration = actionStateDurations;

/**
 * The state machine is `@mittwald/flow-components-base`'s, shared with every
 * remote binding; this adds the hooks.
 */
export class ActionState extends ActionStateBase {
  public static useNew(): ActionState {
    return useStatic(() => new ActionState());
  }

  public useValue(): ActionStateBase["state"] {
    return useSelector(() => this.state, [this]);
  }

  public useIsBusy(): boolean {
    return useSelector(() => this.isBusy, [this]);
  }
}
