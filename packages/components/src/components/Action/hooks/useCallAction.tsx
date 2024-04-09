import type { ActionFn, ActionType } from "@/components/Action/types";
import { useProps } from "@/lib/propsContext";
import { useMakeCallableAction } from "@/components/Action/hooks/useMakeCallableAction";
import { callActionsInOrder } from "@/components/Action/lib/callActionsInOrder";
import { ActionState } from "@/components/Action/ActionState";

interface Options {
  feedback?: boolean;
}

interface ActionController {
  state: ActionState;
  callAction: ActionFn;
}

export const useCallAction = (
  action?: ActionType,
  options?: Options,
): ActionController => {
  const { action: parentAction } = useProps("Action", {});

  const callableAction = useMakeCallableAction(action);

  const state = ActionState.useNew(options);

  const callWithStateHandling: ActionFn = (...args) => {
    try {
      state.onStart();
      const result = callActionsInOrder(args, [callableAction, parentAction]);

      if (result instanceof Promise) {
        return result.then(state.onSucceeded).catch(state.onFailed);
      }

      state.onSucceeded();
    } catch (error) {
      state.onFailed();
    }
  };

  return {
    callAction: callWithStateHandling,
    state,
  };
};
