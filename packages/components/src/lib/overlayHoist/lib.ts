import type { FlowComponentName } from "@/components/propTypes";

/**
 * The overlay types that are hoisted out of a subtree marked by an
 * `OverlayHoistProvider` – the overlays built on `Overlay`, which is the
 * component doing the hoisting.
 */
const hoistableOverlayTypes: FlowComponentName[] = ["Modal", "LightBox"];

export const isHoistableOverlayType = (
  overlayType: FlowComponentName,
): boolean => hoistableOverlayTypes.includes(overlayType);
