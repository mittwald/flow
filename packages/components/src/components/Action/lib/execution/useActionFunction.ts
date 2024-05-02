import type { ActionFn, ActionProps } from "@/components/Action";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import { breakAction } from "@/components/Action/lib/execution/breakAction";

export const voidAction = () => {};

export const useActionFunction = (actionProps: ActionProps): ActionFn => {
  const {
    action,
    toggleOverlay,
    openOverlay,
    closeOverlay,
    break: $break,
  } = actionProps;

  const overlayControllerFromContext = useOverlayController();

  const getOverlayController = (controller: OverlayController | true) =>
    typeof controller === "boolean" ? overlayControllerFromContext : controller;

  return action
    ? action
    : toggleOverlay
      ? getOverlayController(toggleOverlay).toggle
      : openOverlay
        ? getOverlayController(openOverlay).open
        : closeOverlay
          ? getOverlayController(closeOverlay).close
          : $break
            ? breakAction
            : voidAction;
};
