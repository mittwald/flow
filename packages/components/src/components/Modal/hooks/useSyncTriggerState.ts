import { useContext, useEffect } from "react";
import * as Aria from "react-aria-components";
import { OverlayController } from "@/lib/controller/overlayController/types";
import { useSignalEffect } from "@preact/signals-react";

export const useSyncTriggerState = (controller: OverlayController) => {
  const triggerState = useContext(Aria.OverlayTriggerStateContext);

  useEffect(() => {
    if (triggerState) {
      controller.setIsOpen(triggerState.isOpen);
    }
  }, [triggerState?.isOpen]);

  useSignalEffect(() => {
    const isOpen = controller.signals.isOpen.value;

    if (triggerState) {
      triggerState.setOpen(isOpen);
    }
  });
};
