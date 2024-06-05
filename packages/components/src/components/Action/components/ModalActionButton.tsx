import type { FlowRenderFn } from "@/lib/types/props";
import type { ButtonProps } from "@/components/Button";
import React from "react";
import { Action } from "@/components/Action";
import { ActionModel as ActionModel } from "@/components/Action/models/ActionModel";
import { ActionContextProvider } from "@/components/Action/context";
import { getActionGroupSlot } from "@/components/ActionGroup/lib/getActionGroupSlot";
import { ActionComponentsRenderContext } from "@/components/Action/components/ActionComponentsRenderContext";

export const ModalActionButton: FlowRenderFn<ButtonProps> = (
  Button,
  renderProps,
) => {
  const confirmationAction = ActionModel.useConfirmationAction();

  const slot = getActionGroupSlot(renderProps);
  const isAbortButton = slot === "abort";
  const isConfirmButton = slot === "primary";

  if (!isConfirmButton && !isAbortButton) {
    return (
      <ActionComponentsRenderContext>
        <Button {...renderProps} />
      </ActionComponentsRenderContext>
    );
  }

  if (isAbortButton) {
    return (
      <ActionComponentsRenderContext>
        <Action break>
          <Action closeOverlay>
            <Button {...renderProps} slot={slot} />
          </Action>
        </Action>
      </ActionComponentsRenderContext>
    );
  }

  return (
    <ActionComponentsRenderContext>
      <ActionContextProvider value={confirmationAction}>
        <Button {...renderProps} slot={slot} />
      </ActionContextProvider>
    </ActionComponentsRenderContext>
  );
};
