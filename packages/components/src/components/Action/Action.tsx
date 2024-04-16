import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { ActionFn } from "@/components/Action/types";
import { useCallAction } from "@/components/Action/hooks/useCallAction";
import { actions } from "@/components/Action/actionFactory";
import type { OverlayState } from "@/lib/controller/overlay";

export interface ActionProps extends PropsWithChildren {
  action?: ActionFn;
  closeModal?: boolean | OverlayState;
  openModal?: boolean | OverlayState;
  toggleModal?: boolean | OverlayState;
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

  const actionController = useCallAction(action, { feedback });
  const state = actionController.state.useObserve();

  const propsContext: PropsContext = {
    Button: {
      onPress: actionController.callAction,
      isPending: state.isPending,
      isDisabled: state.isExecuting,
      isSucceeded: state.isSucceeded,
      isFailed: state.isFailed,
    },
    Action: {
      action: actionController.callAction,
    },
  };

  return (
    <PropsContextProvider
      mergeInParentContext
      props={propsContext}
      dependencies={Object.values(state)}
    >
      {children}
    </PropsContextProvider>
  );
};

export default Action;
