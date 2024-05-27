import type { FlowRenderFn } from "@/lib/types/props";
import type { ButtonProps } from "@/components/Button";
import React from "react";
import { ActionModel } from "@/components/Action/models/ActionModel";
import { useActionStateContext } from "@/components/Action/models/ActionStateContext";

export const ActionButton: FlowRenderFn<ButtonProps> = (
  Button,
  renderProps,
) => {
  const action = ActionModel.use();
  const state = action.state.useValue();
  const someActionInContextIsBusy = useActionStateContext().useIsBusy();
  const confirmationModalIsOpen =
    action.confirmationModalController.useIsOpen();

  if (confirmationModalIsOpen && action.needsConfirmation) {
    return <Button {...renderProps} onPress={action.execute} />;
  }

  return (
    <Button
      onPress={action.execute}
      isPending={state === "isPending"}
      aria-disabled={state === "isExecuting" || someActionInContextIsBusy}
      isSucceeded={state === "isSucceeded"}
      isFailed={state === "isFailed"}
      {...renderProps}
    />
  );
};
