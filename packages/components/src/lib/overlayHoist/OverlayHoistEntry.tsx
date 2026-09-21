import { type FC, type ReactNode, useEffect, useId } from "react";
import type { OverlayController } from "@/lib/controller";
import type { OverlayHoistRegistry } from "@/lib/overlayHoist/OverlayHoistRegistry";

interface Props {
  registry: OverlayHoistRegistry;
  /** The controller of the hoisted overlay – decides when it may be dropped. */
  controller: OverlayController;
  /** The overlay to render in the registry's outlet. */
  overlay: ReactNode;
}

/**
 * Registers `overlay` with the `OverlayHoistRegistry` of the surrounding
 * `OverlayHoistProvider` and renders nothing in its own place.
 *
 * The entry keeps the registration alive when it unmounts while the overlay is
 * open – that unmount is exactly what happens when a context menu closes
 * because one of its items opened the overlay. The registration is dropped
 * again as soon as the overlay closes.
 */
export const OverlayHoistEntry: FC<Props> = (props) => {
  const { registry, controller, overlay } = props;
  const key = useId();

  useEffect(() => {
    registry.set(key, overlay);
  }, [registry, key, overlay]);

  useEffect(() => {
    return () => {
      if (!controller.isOpen) {
        registry.remove(key);
        return;
      }
      const disposeHandler = controller.addOnClose(() => {
        registry.remove(key);
        disposeHandler();
      });
    };
  }, [registry, key, controller]);

  return null;
};

export default OverlayHoistEntry;
