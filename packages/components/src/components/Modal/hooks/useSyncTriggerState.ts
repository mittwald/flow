import { useContext, useEffect } from "react";
import * as Aria from "react-aria-components";
import { OverlayController } from "@/lib/controller/overlayController/types";

export const useSyncTriggerState = (controller: OverlayController) => {
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
