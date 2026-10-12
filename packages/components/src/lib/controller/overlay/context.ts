import { createContext, useContext } from "react";
import type { OverlayController } from "@/lib/controller/overlay/OverlayController";
import type { FlowComponentName } from "@/components/propTypes";

export interface OverlayContext {
  /**
   * The enclosing overlays' controllers, keyed by the Flow component name the
   * providing overlay registers itself under. Innermost wins per name – a
   * `Modal` inside a `Modal` overwrites the `Modal` entry – but the map does
   * not record which of two differently named overlays is the inner one.
   */
  byType: Partial<Record<FlowComponentName, OverlayController | undefined>>;
  /**
   * The controller of the innermost overlay this subtree is the _content_ of,
   * whatever its component name. `undefined` outside any overlay content.
   *
   * Only providers that wrap overlay content set it. `OverlayTrigger` wraps the
   * trigger as well, so it contributes to `byType` only – an `Action` in the
   * trigger button is not inside the overlay it opens.
   */
  nearest?: OverlayController;
}

export const overlayContext = createContext<OverlayContext>({ byType: {} });

export const useOverlayContext = (): OverlayContext =>
  useContext(overlayContext);
