import { ActionType, ActionFn } from "@/components/Action/types";
import { useProps } from "@/lib/propsContext";
import { useSignals } from "@preact/signals-react/runtime";
import { useSignal } from "@preact/signals-react";
import { useRef } from "react";
import { useMakeCallableAction } from "@/components/Action/hooks/useMakeCallableAction";
import { callActionsInOrder } from "@/components/Action/lib/callActionsInOrder";

interface Result {
  state: {
    isPending: boolean;
    isExecuting: boolean;
    isSucceeded: boolean;
    isFailed: boolean;
  };
  callAction: ActionFn;
}

const duration = {
  pending: 1000,
  succeeded: 1500,
  failed: 2000,
};

interface Options {
  feedback?: boolean;
}

export const useCallAction = (
  action?: ActionType,
  options: Options = {},
): Result => {
  const { feedback = false } = options;
  const { action: parentAction } = useProps("Action", {});
  const callableAction = useMakeCallableAction(action);

  useSignals();
  const isExecuting = useSignal(false);
  const isPending = useSignal(false);
  const isSucceeded = useSignal(false);
  const isFailed = useSignal(false);

  const asyncActionResolved = useRef(false);

  const whenSucceeded = () => {
    if (feedback) {
      isSucceeded.value = true;
    }
  };

  const whenFailed = () => {
    if (feedback) {
      isFailed.value = true;
    }
  };

  const whenDone = () => {
    asyncActionResolved.current = true;
    isExecuting.value = false;
    isPending.value = false;

    if (feedback) {
      setTimeout(() => {
        isSucceeded.value = false;
      }, duration.succeeded);
      setTimeout(() => {
        isFailed.value = false;
      }, duration.failed);
    }
  };

  const callWithStateHandling: ActionFn = (...args) => {
    try {
      asyncActionResolved.current = false;
      const result = callActionsInOrder(args, [callableAction, parentAction]);

      if (result instanceof Promise) {
        isExecuting.value = true;

        setTimeout(() => {
          if (!asyncActionResolved.current) {
            isPending.value = true;
          }
        }, duration.pending);

        return result.then(whenSucceeded).catch(whenFailed).finally(whenDone);
      }

      whenSucceeded();
      whenDone();
    } catch (error) {
      whenFailed();
      whenDone();
    }
  };

  return {
    callAction: callWithStateHandling,
    state: {
      isExecuting: isExecuting.value,
      isPending: isPending.value,
      isSucceeded: isSucceeded.value,
      isFailed: isFailed.value,
    },
  };
};
