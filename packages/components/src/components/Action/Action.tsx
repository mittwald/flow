import type { FC, PropsWithChildren } from "react";
import React, { useEffect, useState } from "react";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { ActionFn } from "@/components/Action/types";
import { OverlayController } from "@/lib/controller/overlay";
import { ActionContextProvider } from "@/components/Action/lib/execution/context";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { useActionController } from "@/components/Action/lib/execution/useActionController";
import type { ButtonProps } from "@/components/Button";
import type { FlowRenderFn } from "@/lib/types/props";
import type { ModalProps } from "@/components/Modal";

export interface ActionProps extends PropsWithChildren {
  action?: ActionFn;
  closeModal?: boolean | OverlayController;
  openModal?: boolean | OverlayController;
  toggleModal?: boolean | OverlayController;
  break?: boolean;
  showFeedback?: boolean;
  /** @internal */
  isConfirmationAction?: boolean;
}

export const Action: FC<ActionProps> = (actionProps) => {
  const [hasConfirmationModal, setHasConfirmationModal] = useState(false);
  const confirmationModalController = OverlayController.useNew();

  const actionController = useActionController(actionProps);

  const interaction = hasConfirmationModal
    ? confirmationModalController.open
    : actionController.callAction;

  const ConfirmationModalRenderer: FlowRenderFn<ModalProps> = (
    Modal,
    props,
  ) => {
    const isConfirmationModal = props.slot === "actionConfirm";

    useEffect(() => {
      if (isConfirmationModal) {
        setHasConfirmationModal(true);
        return () => {
          setHasConfirmationModal(false);
        };
      }
    }, [isConfirmationModal]);

    if (isConfirmationModal) {
      return <Modal controller={confirmationModalController} {...props} />;
    }

    return <Modal {...props} />;
  };

  const ModalButtonRenderer: FlowRenderFn<ButtonProps> = (Button, props) => {
    const { color } = props;

    if (color === "secondary") {
      return (
        <Action break>
          <Action closeModal>
            <Button {...props} />
          </Action>
        </Action>
      );
    }

    return (
      <Action closeModal>
        <Action {...actionProps} isConfirmationAction>
          <Button {...props} />
        </Action>
      </Action>
    );
  };

  const propsContext: PropsContext = {
    Button: {
      onPress: interaction,
      render: (Button, props) => {
        const actionState = actionController.state.useState();
        return (
          <Button
            {...props}
            isPending={actionState === "isPending" ? true : undefined}
            aria-disabled={actionState !== "isIdle" ? true : undefined}
            isSucceeded={actionState === "isSucceeded" ? true : undefined}
            isFailed={actionState === "isFailed" ? true : undefined}
          />
        );
      },
    },
    Modal: {
      tunnelId: "outsideActionProvider",
      render: ConfirmationModalRenderer,
      ButtonGroup: {
        Button: {
          render: ModalButtonRenderer,
        },
      },
    },
  };

  return (
    <TunnelProvider>
      <PropsContextProvider
        props={propsContext}
        dependencies={[hasConfirmationModal]}
        mergeInParentContext
      >
        <ActionContextProvider value={interaction}>
          {actionProps.children}
        </ActionContextProvider>
        <TunnelExit id="outsideActionProvider" />
      </PropsContextProvider>
    </TunnelProvider>
  );
};

export default Action;
