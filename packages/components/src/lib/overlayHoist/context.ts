import { createContext, useContext } from "react";
import type { OverlayHoistRegistry } from "@/lib/overlayHoist/OverlayHoistRegistry";

export const overlayHoistContext = createContext<
  OverlayHoistRegistry | undefined
>(undefined);

/**
 * The registry an overlay declared in this subtree has to be hoisted into, or
 * `undefined` when the overlay can stay where it is declared.
 */
export const useOverlayHoistRegistry = (): OverlayHoistRegistry | undefined =>
  useContext(overlayHoistContext);
