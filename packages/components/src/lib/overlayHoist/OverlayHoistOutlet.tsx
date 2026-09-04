import { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { overlayHoistContext } from "@/lib/overlayHoist/context";
import type { OverlayHoistRegistry } from "@/lib/overlayHoist/OverlayHoistRegistry";

interface Props {
  registry: OverlayHoistRegistry;
}

/**
 * Renders the overlays that have been hoisted into `registry`. Place it inside
 * the `OverlayHoistProvider`, but outside of the subtree that unmounts.
 */
export const OverlayHoistOutlet = observer<Props>((props) => {
  const { registry } = props;
  const overlays = Array.from(registry.overlays.entries());

  if (overlays.length === 0) {
    return null;
  }

  return (
    /* Overlays rendered here are outside the hoisting subtree already – reset
       the context so a nested overlay is not hoisted a second time. */
    <overlayHoistContext.Provider value={undefined}>
      {overlays.map(([key, overlay]) => (
        <Fragment key={key}>{overlay}</Fragment>
      ))}
    </overlayHoistContext.Provider>
  );
});

OverlayHoistOutlet.displayName = "OverlayHoistOutlet";

export default OverlayHoistOutlet;
