import { ActionFn, ActionType } from "@/components/Action/types";
import { useModalController } from "@/components/Modal/controller/useModalController";

const voidAction = () => {};

export const useMakeCallableAction = (action?: ActionType): ActionFn => {
  const modalController = useModalController();

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
