import { useContext } from "react";
import { overlayContext } from "@/lib/controller/overlay/context";
import { OverlayState } from "@/lib/controller/overlay/OverlayState";

interface Options {
  reuseControllerFromContext?: boolean;
  defaultOpen?: boolean;
}

export const useOverlayState = (opts: Options = {}): OverlayState => {
  const { reuseControllerFromContext = true, defaultOpen } = opts;

  const newState = OverlayState.useNew(defaultOpen);
  const stateFromContext = useContext(overlayContext);

  return reuseControllerFromContext && stateFromContext
    ? stateFromContext
    : newState;
};
