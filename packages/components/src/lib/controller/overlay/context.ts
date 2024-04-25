import { createContext } from "react";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";

export const overlayContext = createContext<OverlayController>(
  new OverlayController(),
);

export const OverlayContextProvider = overlayContext.Provider;
