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

  return (
    /* Already outside the hoisting subtree – a nested overlay stays in place */
    <overlayHoistContext.Provider value={undefined}>
      {Array.from(registry.overlays, ([key, overlay]) => (
        <Fragment key={key}>{overlay}</Fragment>
      ))}
    </overlayHoistContext.Provider>
  );
});

OverlayHoistOutlet.displayName = "OverlayHoistOutlet";

export default OverlayHoistOutlet;
