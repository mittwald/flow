import { useContext, useEffect } from "react";
import * as Aria from "react-aria-components";
import { ModalController } from "@/components/Modal/controller/types";

export const useSyncTriggerState = (controller: ModalController) => {
  const triggerState = useContext(Aria.OverlayTriggerStateContext);
  const isOpen = controller.useIsOpen();

  useEffect(() => {
    if (triggerState) {
      controller.setIsOpen(triggerState.isOpen);
    }
  }, [triggerState?.isOpen]);

  useEffect(() => {
    if (triggerState) {
      triggerState.setOpen(isOpen);
    }
  }, [isOpen, triggerState]);
};
