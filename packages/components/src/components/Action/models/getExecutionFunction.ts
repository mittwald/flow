import type { ActionModel } from "@/components/Action/models/ActionModel";
import type { ActionFn } from "@/components/Action";
import type { OverlayController } from "@/lib/controller";
import type { FlowComponentName } from "@/components/propTypes";

const voidAction = () => {
  // do nothing
};

export function getExecutionFunction(action: ActionModel): ActionFn {
  if (action.needsConfirmation) {
    return action.confirmationModalController.open;
  }

  const getOverlayController = (
    from: OverlayController | FlowComponentName,
  ): OverlayController | undefined => {
    if (typeof from === "string") {
      return action.getOverlayController(from);
    }
    return from;
  };

  const { onAction, toggleOverlay, closeOverlay, openOverlay } =
    action.actionProps;

  const maybeAction = onAction
    ? onAction
    : openOverlay
      ? getOverlayController(openOverlay)?.open
      : closeOverlay
        ? getOverlayController(closeOverlay)?.close
        : toggleOverlay
          ? getOverlayController(toggleOverlay)?.toggle
          : voidAction;

  return maybeAction ?? voidAction;
}
