import type { PropsWithChildren } from "react";
import type { OverlayController } from "@/lib/controller";
import type { ActionModel } from "@/components/Action/models/ActionModel";
import type { FlowComponentName } from "@/components/propTypes";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import type {
  CloseModalOptions,
  CloseOverlayOptions,
} from "@/lib/controller/overlay/OverlayController";

export type ActionFn = (...args: unknown[]) => unknown;

export interface ActionProps extends PropsWithChildren, FlowComponentProps {
  /**
   * The function executed when the action is triggered. Returning a promise
   * puts the action into its pending and feedback states automatically.
   */
  onAction?: ActionFn;
  /**
   * An existing action model to use instead of creating a new one. Lets several
   * components share one action state.
   */
  actionModel?: ActionModel;
  /** The overlay to close when the action is triggered. */
  closeOverlay?: FlowComponentName | OverlayController | CloseOverlayOptions;
  /** The overlay to open when the action is triggered. */
  openOverlay?: FlowComponentName | OverlayController;
  /** The overlay to open or close when the action is triggered. */
  toggleOverlay?: FlowComponentName | OverlayController;
  /** Whether the surrounding modal is closed when the action is triggered. */
  closeModal?: boolean | CloseModalOptions;
  /** Whether the surrounding modal is opened when the action is triggered. */
  openModal?: boolean;
  /**
   * Whether the surrounding modal is opened or closed when the action is
   * triggered.
   */
  toggleModal?: boolean;
  /**
   * Stops the execution here: parent actions are not executed.
   *
   * @default false
   */
  break?: boolean;
  /**
   * The number of parent actions skipped when the action is triggered. `true`
   * skips one.
   *
   * @default false
   */
  skip?: number | boolean;
  /**
   * Whether success feedback is shown after the action succeeded. Asynchronous
   * actions show feedback by default; set `false` to suppress it.
   */
  showFeedback?: boolean;
}
