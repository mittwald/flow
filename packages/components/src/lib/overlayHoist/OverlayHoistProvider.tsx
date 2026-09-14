import type { FC, PropsWithChildren } from "react";
import { OverlayHoistRegistry } from "@/lib/overlayHoist/OverlayHoistRegistry";
import { overlayHoistContext } from "@/lib/overlayHoist/context";
import { OverlayHoistOutlet } from "@/lib/overlayHoist/OverlayHoistOutlet";
import { useStatic } from "@/lib/hooks/useStatic";

/**
 * Marks a subtree whose overlays must not be rendered where they are declared,
 * and renders those overlays next to it instead.
 *
 * A `ContextMenu` renders its items inside a popover that unmounts as soon as
 * the menu closes – and activating a menu item closes the menu. An overlay
 * declared inside the menu would therefore be torn down in the very moment it
 * is opened. On top of that, an open menu popover marks everything outside of
 * itself as `inert` (react-aria's `ariaHideOutside`), so an overlay opened
 * while the menu is still open would not be interactive either.
 *
 * Overlays declared inside `children` register themselves here instead
 * (`OverlayHoistEntry`) and are rendered by the outlet below `children` –
 * outside of the popover, and mounted for as long as the overlay is open.
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
