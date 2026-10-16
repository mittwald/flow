import type { FC, PropsWithChildren } from "react";
import { OverlayHoistRegistry } from "@/lib/overlayHoist/OverlayHoistRegistry";
import { overlayHoistContext } from "@/lib/overlayHoist/context";
import { OverlayHoistOutlet } from "@/lib/overlayHoist/OverlayHoistOutlet";
import { useStatic } from "@/lib/hooks/useStatic";

/**
 * Renders the overlays declared in `children` next to `children` instead of in
 * place, for as long as they are open.
 *
 * A `ContextMenu` popover unmounts when an item is activated, and while open it
 * marks everything outside of it `inert` (react-aria's `ariaHideOutside`). An
 * overlay opened from a menu item can live neither inside the popover nor
 * beside a still-open menu – so it registers here (`OverlayHoistEntry`) and is
 * rendered by the outlet, outside of the popover.
 */
export const OverlayHoistProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const registry = useStatic(() => new OverlayHoistRegistry());

  return (
    <overlayHoistContext.Provider value={registry}>
      {children}
      <OverlayHoistOutlet registry={registry} />
    </overlayHoistContext.Provider>
  );
};

export default OverlayHoistProvider;
