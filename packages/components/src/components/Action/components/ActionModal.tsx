import type { FlowRenderFn } from "@/lib/types/props";
import type { ModalProps } from "@/components/Modal";
import React from "react";
import { ActionModel } from "@/components/Action/models/ActionModel";

export const ActionModal: FlowRenderFn<ModalProps> = (Modal, renderProps) => {
  const action = ActionModel.use();
  action.needsConfirmation = renderProps.slot === "actionConfirm";
  const actionIsBusy = action.state.useIsBusy();

  const controller = action.needsConfirmation
    ? action.confirmationModalController
    : action.getOverlayController();

  const isDismissable = actionIsBusy ? false : renderProps.isDismissable;

  return (
    <Modal
      {...renderProps}
      isDismissable={isDismissable}
      controller={controller ?? renderProps.controller}
    >
      {renderProps.children}
    </Modal>
  );
};
