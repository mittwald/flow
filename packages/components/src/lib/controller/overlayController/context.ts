import { type OverlayController } from "@/lib/controller/overlayController/types";
import { createContext } from "react";

interface Context {
  controller: OverlayController | undefined;
}

export const overlayContext = createContext<Context>({
  controller: undefined,
});

export const OverlayContextProvider = overlayContext.Provider;
