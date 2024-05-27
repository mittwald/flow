import type { FC } from "react";
import React from "react";
import { ActionModel as ActionModel } from "@/components/Action/models/ActionModel";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { ActionProps } from "@/components/Action/types";
import { Wrap } from "@/components/Wrap";
import { ActionButton } from "@/components/Action/components/ActionButton";
import { ActionLink } from "@/components/Action/components/ActionLink";
import { ActionModal } from "@/components/Action/components/ActionModal";
import { ActionGroup } from "@/components/Action/components/ActionGroup";
import { ActionContextProvider } from "@/components/Action/context";

export const Action: FC<ActionProps> = (props) => {
  const { children, ...actionProps } = props;

  const actionModel = ActionModel.useNew(actionProps);

  const isRootAction = !actionModel.parentAction;

  const propsContext: PropsContext = {
    Modal: {
      render: ActionModal,
    },
    ButtonGroup: {
      render: ActionGroup,
    },
    Button: {
      render: ActionButton,
    },
    Link: {
      render: ActionLink,
    },
  };

  return (
    <ActionContextProvider value={actionModel}>
      <Wrap if={isRootAction}>
        <PropsContextProvider
          props={propsContext}
          dependencies={[actionModel]}
          mergeInParentContext
        >
          {children}
        </PropsContextProvider>
      </Wrap>
    </ActionContextProvider>
  );
};
