import { ActionFn, ActionType } from "@/components/Action/types";
import { useOverlayController } from "@/lib/controller/overlayController/useOverlayController";

const voidAction = () => {};

export const useMakeCallableAction = (action?: ActionType): ActionFn => {
  const modalController = useOverlayController();

  return action?.type === "function"
    ? action.fn
    : action?.type === "toggleModal"
      ? modalController.toggle
      : action?.type === "openModal"
        ? modalController.open
        : action?.type === "closeModal"
          ? modalController.close
          : voidAction;
};
