import { useContext, useEffect } from "react";
import * as Aria from "react-aria-components";
import type { OverlayState } from "@/lib/controller/overlay";

export const useSyncTriggerState = (controller: OverlayState) => {
  const triggerState = useContext(Aria.OverlayTriggerStateContext);
  const controllerIsOpen = controller.useIsOpen();

  useEffect(() => {
    if (triggerState) {
      controller.setOpen(triggerState.isOpen);
    }
  }, [triggerState?.isOpen]);

  useEffect(() => {
    if (triggerState) {
      triggerState.setOpen(controllerIsOpen);
    }
  }, [controllerIsOpen]);
};
