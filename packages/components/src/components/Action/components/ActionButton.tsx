import type { FlowRenderFn } from "@/lib/types/props";
import type { ButtonProps } from "@/components/Button";
import { useActionContext } from "@/components/Action/context";
import { useActionController } from "@/components/Action/lib/execution/useActionController";
import React from "react";

export const ActionButton: FlowRenderFn<ButtonProps> = (
  Button,
  renderProps,
) => {
  const { actionProps, needsConfirmation } = useActionContext();
  const actionController = useActionController();
  const state = actionController.state.useState();

  if (needsConfirmation) {
    return <Button {...renderProps} onPress={actionController.execute} />;
  }

  if (actionProps.abort) {
    return (
      <Button
        {...renderProps}
        onPress={actionController.execute}
        aria-disabled={state !== "isIdle"}
      />
    );
  }

  return (
    <Button
      {...renderProps}
      onPress={actionController.execute}
      isPending={state === "isPending"}
      aria-disabled={state === "isExecuting"}
      isSucceeded={state === "isSucceeded"}
      isFailed={state === "isFailed"}
    />
  );
};
