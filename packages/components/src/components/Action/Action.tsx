import React, { FC, PropsWithChildren } from "react";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { ActionFn } from "@/components/Action/types";
import { useCallAction } from "@/components/Action/hooks/useCallAction";
import { actions } from "@/components/Action/actionFactory";
import { ModalController } from "@/components/Modal/controller/types";

export interface ActionProps extends PropsWithChildren {
  action?: ActionFn;
  closeModal?: boolean | ModalController;
  openModal?: boolean | ModalController;
  toggleModal?: boolean | ModalController;
  feedback?: boolean;
}

export const Action: FC<ActionProps> = (props) => {
  const {
    children,
    feedback,
    action: actionFn,
    toggleModal,
    openModal,
    closeModal,
  } = props;

  const action = actionFn
    ? actions.fn(actionFn)
    : toggleModal
      ? actions.toggleModal(toggleModal)
      : openModal
        ? actions.openModal(openModal)
        : closeModal
          ? actions.closeModal(closeModal)
          : undefined;

  const { callAction, state } = useCallAction(action, { feedback });

  const propsContext: PropsContext = {
    Button: {
      onPress: callAction,
      isPending: state.isPending,
      isDisabled: state.isExecuting,
      isSucceeded: state.isSucceeded,
      isFailed: state.isFailed,
    },
    Action: {
      action: callAction,
    },
  };

  return (
    <PropsContextProvider
      props={propsContext}
      dependencies={Object.values(state)}
    >
      {children}
    </PropsContextProvider>
  );
};

export default Action;
