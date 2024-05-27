import type { PropsWithChildren } from "react";
import type { OverlayController } from "@/lib/controller";

export type ActionFn = (...args: unknown[]) => unknown;

export interface ActionProps extends PropsWithChildren {
  action?: ActionFn;
  closeOverlay?: boolean | OverlayController;
  openOverlay?: boolean | OverlayController;
  toggleOverlay?: boolean | OverlayController;
  break?: boolean;
  skip?: number | boolean;
  showFeedback?: boolean;
}
