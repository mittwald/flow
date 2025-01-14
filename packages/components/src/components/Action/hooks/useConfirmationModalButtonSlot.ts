import type { ButtonProps } from "~/components/Button";
import useContextSlot from "~/lib/slotContext/useContextSlot";
import { getActionGroupSlot } from "~/components/ActionGroup/lib/getActionGroupSlot";

export const useConfirmationModalButtonSlot = (
  props: ButtonProps,
): string | undefined => {
  const inConfirmationModal = useContextSlot("Modal") === "actionConfirm";
  return inConfirmationModal ? getActionGroupSlot(props) : undefined;
};
