import type { ActionModel } from "@/components/Action/models/ActionModel";
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

  const maybeAction = onAction
    ? onAction
    : openOverlay
      ? () => action.getOverlayController(openOverlay)?.open()
      : closeOverlay
        ? () => action.getOverlayController(closeOverlay)?.close()
        : toggleOverlay
          ? () => action.getOverlayController(toggleOverlay)?.toggle()
          : openModal
            ? () => action.getOverlayController("Modal")?.open()
            : toggleModal
              ? () => action.getOverlayController("Modal")?.toggle()
              : closeModal
                ? () => action.getOverlayController("Modal")?.close()
                : voidAction;

  return maybeAction ?? voidAction;
}
