import type { FlowRenderFn } from "@/lib/types/props";
import React from "react";
import { ActionStateContextProvider } from "@/components/Action/models/ActionStateContext";
import type { ButtonGroupProps } from "@/components/ButtonGroup";

export const ActionGroup: FlowRenderFn<ButtonGroupProps> = (
  ButtonGroup,
  renderProps,
) => {
  return (
    <ButtonGroup {...renderProps}>
      <ActionStateContextProvider>
        {renderProps.children}
      </ActionStateContextProvider>
    </ButtonGroup>
  );
};
