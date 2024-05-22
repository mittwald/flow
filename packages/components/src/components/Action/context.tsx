import { createContext, useContext, useMemo } from "react";
import type { ActionProps } from "@/components/Action/types";
import { OverlayController, useOverlayController } from "@/lib/controller";
import { ActionState } from "@/components/Action/lib/execution/ActionState";

export interface ActionContextValue {
  actionProps: ActionProps;
  parentContext?: ActionContextValue;
  confirmationModalController: OverlayController;
  needsConfirmation: boolean;
  overlayController: OverlayController;
  state: ActionState;
}

const context = createContext<ActionContextValue>({
  actionProps: {},
  state: new ActionState(),
  overlayController: new OverlayController(),
  confirmationModalController: new OverlayController(),
  needsConfirmation: false,
});

export const ActionContextProvider = context.Provider;

export const useActionContext = (): ActionContextValue => useContext(context);

export const useNewActionContext = (props: ActionProps): ActionContextValue => {
  const parentContext = useActionContext();
  const overlayController = useOverlayController();
  const state = ActionState.useNew();
  const confirmationModalController = useOverlayController();

  return useMemo(
    () => ({
      actionProps: props,
      parentContext,
      overlayController,
      state,
      confirmationModalController,
      needsConfirmation: false,
    }),
    [
      props,
      parentContext,
      overlayController,
      state,
      confirmationModalController,
    ],
  );
};
