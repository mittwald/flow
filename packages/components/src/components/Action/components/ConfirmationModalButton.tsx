import type { FlowRenderFn } from "@/lib/types/props";
import type { ButtonProps } from "@/components/Button";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { ActionButton } from "@/components/Action/components/ActionButton";
import React from "react";
import { Action } from "@/components/Action";

export const ConfirmationModalButton: FlowRenderFn<ButtonProps> = (
  Button,
  renderProps,
) => {
  const isAbortButton = renderProps.color === "secondary";
  const isConfirmButton =
    renderProps.color === "primary" ||
    renderProps.color === "danger" ||
    renderProps.color === "accent";

  if (!isConfirmButton && !isAbortButton) {
    return <Button {...renderProps} />;
  }

  const propsContext: PropsContext = { Button: { render: ActionButton } };

  return (
    <PropsContextProvider props={propsContext}>
      <Action abort={isAbortButton} confirm={isConfirmButton}>
        <Button {...renderProps} />
      </Action>
    </PropsContextProvider>
  );
};
