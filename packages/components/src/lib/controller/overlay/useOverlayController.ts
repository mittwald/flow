import { useOverlayContext } from "@/lib/controller/overlay/context";
import type { OverlayControllerOptions } from "@/lib/controller/overlay/OverlayController";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";
import type { FlowComponentName } from "@/components/propTypes";
import { useEffect } from "react";

interface Options extends OverlayControllerOptions {
  reuseControllerFromContext?: boolean;
}

export const useOverlayController = (
  overlayType: FlowComponentName,
  opts: Options = {},
): OverlayController => {
  const {
    reuseControllerFromContext = true,
    isDefaultOpen,
    onOpen,
    onClose,
  } = opts;

  const newController = OverlayController.useNew({
    isDefaultOpen,
    onOpen,
    onClose,
  });
  const controllerFromContext = useOverlayContext()[overlayType];

  const controller =
    reuseControllerFromContext && controllerFromContext
      ? controllerFromContext
      : newController;

  useEffect(() => {
    const disposers: (() => void)[] = [];

    if (onOpen && !controller.isOpen) {
      disposers.push(controller.addOnOpen(onOpen));
    }

    if (onClose && controller.isOpen) {
      disposers.push(controller.addOnClose(onClose));
    }

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [onOpen, onClose, controller.isOpen]);

  return controller;
};
