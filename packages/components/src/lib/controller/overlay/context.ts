import { createContext } from "react";
import { OverlayState } from "@/lib/controller/overlay/OverlayState";

export const overlayContext = createContext<OverlayState>(new OverlayState());

export const OverlayContextProvider = overlayContext.Provider;
