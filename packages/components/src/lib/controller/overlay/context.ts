import { createContext, useContext } from "react";
import type { OverlayController } from "~/lib/controller/overlay/OverlayController";
import type { FlowComponentName } from "~/components/propTypes";

export type OverlayContext = Partial<
  Record<FlowComponentName, OverlayController | undefined>
>;

export const overlayContext = createContext<OverlayContext>({});

export const useOverlayContext = (): OverlayContext =>
  useContext(overlayContext);
