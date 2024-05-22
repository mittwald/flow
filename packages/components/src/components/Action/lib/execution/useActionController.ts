import type { ActionFn } from "@/components/Action/types";
import type { ActionState } from "@/components/Action/lib/execution/ActionState";
import type { ActionContextValue } from "@/components/Action/context";
import { useActionContext } from "@/components/Action/context";
import { callAndReact } from "@/lib/promises/callAndReact";
import { ActionExecution } from "@/components/Action/lib/execution/ActionExecution";
import { callFunctionsInOrder } from "@/lib/promises/callFunctionsInOrder";
import type { OverlayController } from "@/lib/controller";

interface UseActionController {
  execute: ActionFn;
  state: ActionState;
}

const voidAction = () => {
  // do nothing
};

export const useActionController = (): UseActionController => {
  const context = useActionContext();

  const state =
    context.actionProps.confirm || context.actionProps.abort
      ? context.parentContext?.state ?? context.state
      : context.state;

  return {
    state,
    execute: async (...args) => {
      const {
        actionProps,
        confirmationModalController,
        needsConfirmation,
        parentContext,
      } = context;

      if (actionProps.abort) {
        parentContext?.confirmationModalController?.close();
        return;
      }

      if (needsConfirmation && !confirmationModalController.isOpen) {
        confirmationModalController.open();
        return;
      }

      const actionExecution = new ActionExecution(state, args, actionProps);

      const executionChain: ActionFn[] = [];

      let activeConfirmationModalController: OverlayController | undefined;
      let nextConfirmationModalController: OverlayController | undefined;

      let currentContext: ActionContextValue | undefined = context;

      while (currentContext) {
        const {
          actionProps,
          overlayController,
          confirmationModalController,
          needsConfirmation,
        } = currentContext;

        const {
          action,
          toggleOverlay,
          openOverlay,
          closeOverlay,
          break: $break,
        } = actionProps;

        if ($break) {
          break;
        }

        if (needsConfirmation) {
          if (activeConfirmationModalController) {
            nextConfirmationModalController = confirmationModalController;
            break;
          } else {
            activeConfirmationModalController = confirmationModalController;
          }
        }

        const getOverlayController = (
          controllerFromProp: OverlayController | true,
        ) =>
          typeof controllerFromProp === "boolean"
            ? overlayController
            : controllerFromProp;

        executionChain.push(
          action
            ? action
            : toggleOverlay
              ? getOverlayController(toggleOverlay).toggle
              : openOverlay
                ? getOverlayController(openOverlay).open
                : closeOverlay
                  ? getOverlayController(closeOverlay).close
                  : voidAction,
        );

        currentContext = currentContext.parentContext;
      }

      const executionChainFn = callFunctionsInOrder(executionChain);

      actionExecution.setResetDelay(
        activeConfirmationModalController ? 500 : 0,
      );

      await callAndReact(() => executionChainFn(args), {
        onAsync: () => actionExecution.onAsyncStart(),
        then: async () => {
          await actionExecution.onSucceeded();

          if (nextConfirmationModalController) {
            nextConfirmationModalController.open();
          }

          if (activeConfirmationModalController) {
            activeConfirmationModalController.close();
          }
        },
        catch: (error) => actionExecution.onFailed(error),
      });
    },
  };
};
