import type { PropsWithChildren } from "react";
import type { OverlayController } from "@/lib/controller";
import type { ActionModel } from "@/components/Action/models/ActionModel";
import type { FlowComponentName } from "@/components/propTypes";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";

export type ActionFn = (...args: unknown[]) => unknown;

export interface ActionProps extends PropsWithChildren, FlowComponentProps {
  onAction?: ActionFn;
  actionModel?: ActionModel;
  closeOverlay?: FlowComponentName | OverlayController;
  openOverlay?: FlowComponentName | OverlayController;
  toggleOverlay?: FlowComponentName | OverlayController;
  closeModal?: boolean;
  openModal?: boolean;
  toggleModal?: boolean;
  break?: boolean;
  skip?: number | boolean;
  showFeedback?: boolean;
}
