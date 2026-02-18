import type { OverlayController } from "@/lib/controller/overlay/OverlayController";
import { useModalController } from "@/lib/controller/overlay/useModalController";
import { useEffect } from "react";

export const useCloseOverlayConfirmationController = (
  parentController: OverlayController,
) => {
  const showConfirmationModal = parentController.useShowConfirmationModal();

  const confirmationModalController = useModalController({
    reuseControllerFromContext: false,
    onClose: () => {
      if (showConfirmationModal) {
        parentController.cancelConfirmation();
      }
    },
  });

  useEffect(() => {
    if (showConfirmationModal) {
      confirmationModalController.open();
    }
  }, [confirmationModalController, showConfirmationModal]);

  if (parentController.confirmClose) {
    return {
      controller: confirmationModalController,
      cancel: () => parentController.cancelConfirmation(),
      confirm: () => {
        parentController.confirmClose();
        parentController.close();
      },
    } as const;
  }
};
