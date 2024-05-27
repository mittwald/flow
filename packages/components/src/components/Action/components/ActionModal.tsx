import type { FlowRenderFn } from "@/lib/types/props";
import type { ModalProps } from "@/components/Modal";
import React from "react";
import { ActionModel } from "@/components/Action/models/ActionModel";
import { PropsContextProvider } from "@/lib/propsContext";
import { ConfirmationModalButton } from "@/components/Action/components/ConfirmationModalButton";
import { Wrap } from "@/components/Wrap";
import { ActionGroup } from "@/components/Action/components/ActionGroup";

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
      <Wrap if={action.needsConfirmation}>
        <PropsContextProvider
          props={{
            ButtonGroup: {
              render: ActionGroup,
              Button: {
                render: ConfirmationModalButton,
              },
            },
          }}
          mergeInParentContext
        >
          {renderProps.children}
        </PropsContextProvider>
      </Wrap>
    </Modal>
  );
};
