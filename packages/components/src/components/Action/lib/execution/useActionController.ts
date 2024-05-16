import type { ActionFn } from "@/components/Action/types";
import { callFunctionsInOrder } from "@/lib/promises/callFunctionsInOrder";
import { useParentAction } from "@/components/Action/lib/execution/context";
import type { ActionProps } from "@/components/Action/Action";
import { ActionExecution } from "@/components/Action/lib/execution/ActionExecution";
import { ActionState } from "@/components/Action/lib/execution/ActionState";
import { useActionFunction } from "@/components/Action/lib/execution/useActionFunction";
import { callAndReact } from "@/lib/promises/callAndReact";
import { useMemo } from "react";
import { omit, values } from "remeda";

interface UseActionController {
  callAction: ActionFn;
  state: ActionState;
}

export const useActionController = (
  actionProps: ActionProps,
): UseActionController => {
  const { isConfirmationAction, showFeedback } = actionProps;

  const localAction = useActionFunction(actionProps);
  const parentAction = useParentAction();
  const state = ActionState.useNew();

  const resetAfterDone = !isConfirmationAction;

  const nextAction = isConfirmationAction ? undefined : parentAction;
  const afterFeedbackDoneAction = isConfirmationAction
    ? parentAction
    : undefined;

  const action = callFunctionsInOrder([localAction, nextAction]);

  const callAction: ActionFn = (...args) => {
    const execution = new ActionExecution(state, args, {
      onFeedbackDone: afterFeedbackDoneAction,
      resetAfterDone,
      showFeedback,
    });

    return callAndReact(action, {
      onAsync: () => execution.onAsyncStart(),
      then: () => execution.onSucceeded(),
      catch: (err) => execution.onFailed(err),
    });
  };

  const dependencies = values(omit(actionProps, ["children"]));

  return useMemo(
    () => ({
      callAction,
      state,
    }),
    dependencies,
  );
};
