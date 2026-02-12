import { useOverlayContext } from "@/lib/controller/overlay/context";
import type { OverlayControllerOptions } from "@/lib/controller/overlay/OverlayController";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";
import type { FlowComponentName } from "@/components/propTypes";

export interface UseOverlayControllerOptions extends OverlayControllerOptions {
  reuseControllerFromContext?: boolean;
}

export const useOverlayController = (
  overlayType: FlowComponentName,
  opts: UseOverlayControllerOptions = {},
): OverlayController => {
  const {
    reuseControllerFromContext = true,
    isDefaultOpen,
    onOpen,
    onClose,
    onOpenChange,
  } = opts;

  const newController = OverlayController.useNew({
    isDefaultOpen,
    onOpen,
    onClose,
    onOpenChange,
  });
  const controllerFromContext = useOverlayContext()[overlayType];

  const controller =
    reuseControllerFromContext && controllerFromContext
      ? controllerFromContext
      : newController;

  controller.useOnOpen(onOpen);
  controller.useOnClose(onClose);
  controller.useOnOpenChange(onOpenChange);

  return controller;
};
