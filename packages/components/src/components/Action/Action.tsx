import { ActionModel as ActionModel } from "@/components/Action/models/ActionModel";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { ActionContextProvider } from "@/components/Action/context";
import { useActionStateContext } from "@/components/Action/models/ActionStateContext";
import { useConfirmationModalButtonSlot } from "@/components/Action/hooks/useConfirmationModalButtonSlot";
import { useActionButtonState } from "@/components/Action/hooks/useActionButtonState";
import type { ComponentPropsContext } from "@/lib/propsContext/types";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { ActionFn } from "@/components/Action/types";
import { useActionState } from "@/components/Action/hooks/useActionState";

const actionButtonContext: ComponentPropsContext<"Button"> = {
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

  isPending: dynamic((props) => {
    const actionState = useActionButtonState(props);
    return props.isPending ?? actionState === "isPending";
  }),

  isSucceeded: dynamic((props) => {
    const actionState = useActionButtonState(props);
    return props.isSucceeded ?? actionState === "isSucceeded";
  }),

  isFailed: dynamic((props) => {
    const actionState = useActionButtonState(props);
    return props.isFailed ?? actionState === "isFailed";
  }),

  "aria-disabled": dynamic((props) => {
    const state = useActionButtonState(props);
    const someActionInContextIsBusy = useActionStateContext().useIsBusy();
    return (
      props["aria-disabled"] ??
      (state === "isExecuting" || someActionInContextIsBusy)
    );
  }),
};

export const Action = flowComponent(
  "Action",
  (props) => {
    const {
      children,
      actionModel: actionModelFromProps,
      ...actionProps
    } = props;

    if ("action" in actionProps && typeof actionProps.action === "function") {
      console.warn(
        "The 'action' prop is now deprecated. Use 'onAction' instead.",
      );
      if ("onAction" in actionProps === false) {
        actionProps.onAction = actionProps.action as ActionFn;
      }
    }

    const newActionModel = ActionModel.useNew(actionProps);
    const actionModel = actionModelFromProps ?? newActionModel;

    const propsContext: PropsContext = {
      Button: actionButtonContext,

      Link: {
        onPress: dynamic(() => ActionModel.use().execute),
      },

      MenuItem: {
        onAction: dynamic(() => ActionModel.use().execute),
        isPending: dynamic((props) => {
          const actionState = useActionState();
          return props.isPending ?? actionState === "isPending";
        }),
        isSucceeded: dynamic((props) => {
          const actionState = useActionState();
          return props.isSucceeded ?? actionState === "isSucceeded";
        }),
        isFailed: dynamic((props) => {
          const actionState = useActionState();
          return props.isFailed ?? actionState === "isFailed";
        }),
        "aria-disabled": dynamic((props) => {
          const state = useActionState();
          const someActionInContextIsBusy = useActionStateContext().useIsBusy();
          return (
            props["aria-disabled"] ??
            (state === "isExecuting" || someActionInContextIsBusy)
          );
        }),
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
          const actionState = action.state.useValue();
          return actionState === "isExecuting" || actionState === "isPending"
            ? false
            : props.isDismissable;
        }),
        controller: dynamic(() => {
          const action = ActionModel.use();
          return action.needsConfirmation
            ? action.confirmationModalController
            : action.getOverlayController("Modal");
        }),
        ActionGroup: {
          Button: actionButtonContext,
        },
      },
    };

    return (
      <ActionContextProvider value={actionModel}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </ActionContextProvider>
    );
  },
  {
    type: "provider",
  },
);

export default Action;
