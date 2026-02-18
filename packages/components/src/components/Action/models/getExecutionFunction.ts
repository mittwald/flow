import { ActionModel } from "@/components/Action/models/ActionModel";
import { type ActionFn } from "@/components/Action";

const voidAction = () => {
  // do nothing
};

export function getExecutionFunction(action: ActionModel): ActionFn {
  if (action.needsConfirmation) {
    return action.confirmationModalController.open;
  }

  const {
    onAction,
    toggleOverlay,
    closeOverlay,
    openOverlay,
    openModal,
    closeModal,
    toggleModal,
  } = action.actionProps;

  if (onAction) {
    return onAction;
  }

  if (openOverlay) {
    return () => action.getOverlayController(openOverlay)?.open();
  }
  if (closeOverlay) {
    return () =>
      action
        .getOverlayController(closeOverlay)
        ?.close(ActionModel.getCloseOverlayOptions(closeOverlay));
  }
  if (toggleOverlay) {
    return () => action.getOverlayController(toggleOverlay)?.toggle();
  }

  if (openModal) {
    return () => action.getOverlayController("Modal")?.open();
  }
  if (toggleModal) {
    return () => action.getOverlayController("Modal")?.toggle();
  }
  if (closeModal) {
    return () =>
      action
        .getOverlayController("Modal")
        ?.close(ActionModel.getCloseOverlayOptions(closeModal));
  }

  return voidAction;
}
