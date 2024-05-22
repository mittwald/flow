import type { FC } from "react";
import React from "react";
import {
  ActionContextProvider,
  useNewActionContext,
} from "@/components/Action/context";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { ActionProps } from "@/components/Action/types";
import { Wrap } from "@/components/Wrap";
import { ActionButton } from "@/components/Action/components/ActionButton";
import { ActionLink } from "@/components/Action/components/ActionLink";
import { ConfirmationModalButton } from "@/components/Action/components/ConfirmationModalButton";
import { ConfirmationModal } from "@/components/Action/components/ConfirmationModal";

export const Action: FC<ActionProps> = (props) => {
  const { children, ...actionProps } = props;

  const actionContext = useNewActionContext(actionProps);

  const isNestedAction =
    !!actionContext.parentContext &&
    !!actionContext.parentContext.parentContext;

  const propsContext: PropsContext = {
    Modal: {
      render: ConfirmationModal,
      ButtonGroup: {
        Button: {
          render: ConfirmationModalButton,
        },
      },
    },
    Button: {
      render: ActionButton,
    },
    Link: {
      render: ActionLink,
    },
  };

  return (
    <ActionContextProvider value={actionContext}>
      <Wrap if={!isNestedAction}>
        <PropsContextProvider
          props={propsContext}
          dependencies={[actionContext]}
          mergeInParentContext
        >
          {children}
        </PropsContextProvider>
      </Wrap>
    </ActionContextProvider>
  );
};
