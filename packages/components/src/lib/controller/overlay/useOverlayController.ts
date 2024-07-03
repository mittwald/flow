import { useOverlayContext } from "@/lib/controller/overlay/context";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";
import type { FlowComponentName } from "@/components/propTypes";

interface Options {
  reuseControllerFromContext?: boolean;
  defaultOpen?: boolean;
}

export const useOverlayController = (
  overlayType: FlowComponentName,
  opts: Options = {},
): OverlayController => {
  const { reuseControllerFromContext = true, defaultOpen } = opts;

  const newController = OverlayController.useNew(defaultOpen);
  const controllerFromContext = useOverlayContext()[overlayType];

  return reuseControllerFromContext && controllerFromContext
    ? controllerFromContext
    : newController;
};
