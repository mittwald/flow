import type { FC } from "react";
import React from "react";
import { ActionModel as ActionModel } from "@/components/Action/models/ActionModel";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { ActionProps } from "@/components/Action/types";
import { ActionModal } from "@/components/Action/components/ActionModal";
import { ActionContextProvider } from "@/components/Action/context";
import { ModalActionButton } from "@/components/Action/components/ModalActionButton";
import { ActionComponentsRenderContext } from "@/components/Action/components/ActionComponentsRenderContext";

export const Action: FC<ActionProps> = (props) => {
  const { children, ...actionProps } = props;
  const actionModel = ActionModel.useNew(actionProps);

  const propsContext: PropsContext = {
    Modal: {
      render: ActionModal,
      ActionGroup: {
        Button: {
          render: ModalActionButton,
        },
      },
    },
  };

  return (
    <ActionContextProvider value={actionModel}>
      <ActionComponentsRenderContext>
        <PropsContextProvider props={propsContext} mergeInParentContext>
          {children}
        </PropsContextProvider>
      </ActionComponentsRenderContext>
    </ActionContextProvider>
  );
};
