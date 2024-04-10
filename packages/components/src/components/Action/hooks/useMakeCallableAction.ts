import type { ActionFn, ActionType } from "@/components/Action/types";
import { useOverlayState } from "@/lib/controller/overlay/useOverlayState";

const voidAction = () => {};

export const useMakeCallableAction = (action?: ActionType): ActionFn => {
  const modalController = useOverlayState();

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
