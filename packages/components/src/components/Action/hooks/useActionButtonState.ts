import type { ButtonProps } from "~/components/Button";
import type { ActionStateValue } from "~/components/Action/models/ActionState";
import { ActionModel } from "~/components/Action/models/ActionModel";
import { useConfirmationModalButtonSlot } from "~/components/Action/hooks/useConfirmationModalButtonSlot";

export const useActionButtonState = (props: ButtonProps): ActionStateValue => {
  const action = ActionModel.use();
  const state = action.state.useValue();
  const isConfirmationButton =
    useConfirmationModalButtonSlot(props) === "primary";
  const confirmationModalIsOpen =
    action.confirmationModalController.useIsOpen();

  if (
    action.needsConfirmation &&
    confirmationModalIsOpen &&
    !isConfirmationButton
  ) {
    return "isIdle";
  }

  return state;
};
