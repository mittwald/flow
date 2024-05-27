import type { FlowRenderFn } from "@/lib/types/props";
import type { ButtonProps } from "@/components/Button";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { ActionButton } from "@/components/Action/components/ActionButton";
import React from "react";
import { Action } from "@/components/Action";
import { ActionModel as ActionModel } from "@/components/Action/models/ActionModel";
import { ActionContextProvider } from "@/components/Action/context";

export const ConfirmationModalButton: FlowRenderFn<ButtonProps> = (
  Button,
  renderProps,
) => {
  const action = ActionModel.useConfirmationAction();

  const isAbortButton = renderProps.color === "secondary";
  const isConfirmButton =
    renderProps.color === "primary" ||
    renderProps.color === "danger" ||
    renderProps.color === "accent";

  if (!isConfirmButton && !isAbortButton) {
    return <Button {...renderProps} />;
  }

  const propsContext: PropsContext = { Button: { render: ActionButton } };

  if (isAbortButton) {
    return (
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <Action break>
          <Action closeOverlay>
            <Button {...renderProps} />
          </Action>
        </Action>
      </PropsContextProvider>
    );
  }

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <ActionContextProvider value={action}>
        <Button {...renderProps} />
      </ActionContextProvider>
    </PropsContextProvider>
  );
};
