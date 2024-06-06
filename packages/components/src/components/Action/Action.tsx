import type { FC } from "react";
import React from "react";
import { ActionModel as ActionModel } from "@/components/Action/models/ActionModel";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import type { ActionProps } from "@/components/Action/types";
import { ActionContextProvider } from "@/components/Action/context";
import { useActionStateContext } from "@/components/Action/models/ActionStateContext";
import { useConfirmationModalButtonSlot } from "@/components/Action/hooks/useConfirmationModalButtonSlot";
import { useActionButtonState } from "@/components/Action/hooks/useActionButtonState";

export const Action: FC<ActionProps> = (props) => {
  const { children, ...actionProps } = props;
  const actionModel = ActionModel.useNew(actionProps);

  const propsContext: PropsContext = {
    Button: {
      onPress: dynamic((props) => {
        const action = ActionModel.use();
        const confirmAction = ActionModel.useConfirmationAction();
        const isConfirmationButton =
          useConfirmationModalButtonSlot(props) === "primary";
        const isAbortButton = useConfirmationModalButtonSlot(props) === "abort";
        if (isAbortButton) {
          return action.confirmationModalController.close;
        }
        return isConfirmationButton ? confirmAction.execute : action.execute;
      }),
      isPending: dynamic(
        (props) => useActionButtonState(props) === "isPending",
      ),
      isSucceeded: dynamic(
        (props) => useActionButtonState(props) === "isSucceeded",
      ),
      isFailed: dynamic((props) => useActionButtonState(props) === "isFailed"),
      "aria-disabled": dynamic(() => {
        const state = useActionButtonState(props);
        const someActionInContextIsBusy = useActionStateContext().useIsBusy();
        return state === "isExecuting" || someActionInContextIsBusy;
      }),
    },

    Link: {
      onPress: dynamic(() => ActionModel.use().execute),
    },

    Modal: {
      slot: dynamic((props) => {
        const { slot } = props;
        const action = ActionModel.use();
        action.needsConfirmation = slot === "actionConfirm";
        return slot;
      }),
      isDismissable: dynamic((props) => {
        const action = ActionModel.use();
        const actionIsBusy = action.state.useIsBusy();
        return actionIsBusy ? false : props.isDismissable;
      }),
      controller: dynamic(() => {
        const action = ActionModel.use();
        return action.needsConfirmation
          ? action.confirmationModalController
          : action.getOverlayController();
      }),
    },
  };

  return (
    <ActionContextProvider value={actionModel}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        {children}
      </PropsContextProvider>
    </ActionContextProvider>
  );
};
