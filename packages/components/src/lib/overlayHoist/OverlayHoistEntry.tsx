import { type FC, type ReactNode, useEffect, useId } from "react";
import type { OverlayController } from "@/lib/controller";
import type { OverlayHoistRegistry } from "@/lib/overlayHoist/OverlayHoistRegistry";

interface Props {
  registry: OverlayHoistRegistry;
  controller: OverlayController;
  overlay: ReactNode;
}

/**
 * Registers `overlay` with the surrounding `OverlayHoistProvider` and renders
 * nothing in place. Unmounting while the overlay is open – the menu closing –
 * keeps the registration until the overlay closes.
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
