import { useOverlayContext } from "@/lib/controller/overlay/context";
import type { OverlayControllerOptions } from "@/lib/controller/overlay/OverlayController";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";
import type { FlowComponentName } from "@/components/propTypes";

export interface UseOverlayControllerOptions extends OverlayControllerOptions {
  reuseControllerFromContext?: boolean;
}

export const useOverlayController = (
  overlayType: FlowComponentName,
  options: UseOverlayControllerOptions = {},
): OverlayController => {
  const { reuseControllerFromContext = true, ...restControllerOptions } =
    options;

  const newController = OverlayController.useNew(restControllerOptions);
  const controllerFromContext = useOverlayContext()[overlayType];

  const controller =
    reuseControllerFromContext && controllerFromContext
      ? controllerFromContext
      : newController;

  if (controller === controllerFromContext) {
    controller.useUpdateOptions(restControllerOptions);
  }

  return controller;
};
