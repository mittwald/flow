import type { ActionModel } from "@/components/Action/models/ActionModel";
import type { ActionFn } from "@/components/Action";

const voidAction = () => {
  // do nothing
};

export function getExecutionFunction(action: ActionModel): ActionFn {
  if (action.needsConfirmation) {
    return action.confirmationModalController.open;
  }

  const overlayController = action.getOverlayController();

  const {
    action: actionFn,
    toggleOverlay,
    closeOverlay,
    openOverlay,
  } = action.actionProps;

  return actionFn
    ? actionFn
    : openOverlay && overlayController
      ? overlayController.open
      : closeOverlay && overlayController
        ? overlayController.close
        : toggleOverlay && overlayController
          ? overlayController.close
          : voidAction;
}
