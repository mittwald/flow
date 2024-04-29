import type { ActionFn, ActionProps } from "@/components/Action";
import { useOverlayController } from "@/lib/controller";
import { breakAction } from "@/components/Action/lib/execution/breakAction";

export const voidAction = () => {};

export const useActionFunction = (actionProps: ActionProps): ActionFn => {
  const {
    action,
    toggleModal,
    openModal,
    closeModal,
    break: $break,
  } = actionProps;

  const modalController = useOverlayController();

  return action
    ? action
    : toggleModal
      ? modalController.toggle
      : openModal
        ? modalController.open
        : closeModal
          ? modalController.close
          : $break
            ? breakAction
            : voidAction;
};
