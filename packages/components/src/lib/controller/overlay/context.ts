import { createContext } from "react";
import type { OverlayController } from "@/lib/controller/overlay/OverlayController";

export const overlayContext = createContext<OverlayController | undefined>(
  undefined,
);

export const OverlayContextProvider = overlayContext.Provider;
