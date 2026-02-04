import { type PropsWithChildren } from "react";
import {
  type OverlayController,
  useOverlayController,
} from "@/lib/controller/overlay";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { UnsavedChangesConfirmationModal } from "@/components/Modal/components/UnsavedChangesConfirmationModal";
import ModalBase from "@/components/Modal/ModalBase";

export interface ModalProps
  extends PropsWithChildren, FlowComponentProps, PropsWithClassName {
  /** The size of the modal. @default "s" */
  size?: "s" | "m" | "l";
  /** Whether the modal should be displayed as an off canvas. */
  offCanvas?: boolean;
  /**
   * Whether the off canvas should be displayed on the right or left side of the
   * screen. @default "right"
   */
  offCanvasOrientation?: "left" | "right";
  /** An overlay controller to control the modal state. */
  controller?: OverlayController;
  /**
   * Accepts "actionConfirm" to use the modal as a confirmation modal for an
   * action.
   */
  slot?: string;
  /** Whether the modal can be closed by clicking outside of it. */
  isDismissable?: boolean;
  /** Disables the confirmation dialog when there are unsaved changes. */
  disableUnsavedChangesConfirmation?: boolean;
}

export const Modal = flowComponent("Modal", (props) => {
  const { controller: controllerFromProps, ...rest } = props;

  const controllerFromContext = useOverlayController("Modal");

  const controller = controllerFromProps ?? controllerFromContext;

  const unsavedChangesConfirmationController = useOverlayController("Modal", {
    reuseControllerFromContext: false,
  });

  return (
    <>
      <ModalBase
        controller={controller}
        unsavedChangesConfirmationController={
          unsavedChangesConfirmationController
        }
        {...rest}
      />

      <UnsavedChangesConfirmationModal
        controller={controller}
        unsavedChangesConfirmationController={
          unsavedChangesConfirmationController
        }
      />
    </>
  );
});

export default Modal;
