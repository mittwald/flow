import { useOverlayContext } from "@/lib/controller/overlay/context";
import type { OverlayControllerOptions } from "@/lib/controller/overlay/OverlayController";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";
import type { FlowComponentName } from "@/components/propTypes";

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

  return reuseControllerFromContext && controllerFromContext
    ? controllerFromContext
    : newController;
};
