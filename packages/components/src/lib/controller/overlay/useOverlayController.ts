import { useContext } from "react";
import { overlayContext } from "@/lib/controller/overlay/context";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";

interface Options {
  reuseControllerFromContext?: boolean;
  defaultOpen?: boolean;
}

export const useOverlayController = (opts: Options = {}): OverlayController => {
  const { reuseControllerFromContext = true, defaultOpen } = opts;

  const newState = OverlayController.useNew(defaultOpen);
  const stateFromContext = useContext(overlayContext);

  return reuseControllerFromContext && stateFromContext
    ? stateFromContext
    : newState;
};
