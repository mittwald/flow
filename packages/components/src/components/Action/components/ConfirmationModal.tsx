import type { FlowRenderFn } from "@/lib/types/props";
import type { ModalProps } from "@/components/Modal";
import { useActionContext } from "@/components/Action/context";
import { useActionController } from "@/components/Action/lib/execution/useActionController";
import React, { useEffect } from "react";

export const ConfirmationModal: FlowRenderFn<ModalProps> = (
  Modal,
  renderProps,
) => {
  if (renderProps.slot !== "actionConfirm") {
    return <Modal {...renderProps} />;
  }

  const actionContext = useActionContext();
  const actionState = useActionController().state.useState();

  useEffect(() => {
    actionContext.needsConfirmation = true;
    return () => {
      actionContext.needsConfirmation = false;
    };
  }, [actionContext]);

  const isDismissable =
    actionState === "isIdle" ? renderProps.isDismissable : false;

  return (
    <Modal
      {...renderProps}
      controller={actionContext.confirmationModalController}
      isDismissable={isDismissable}
    />
  );
};
