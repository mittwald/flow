import React, { FC, PropsWithChildren } from "react";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { ActionFn } from "@/components/Action/types";
import { useCallAction } from "@/components/Action/hooks/useCallAction";

export interface ActionProps extends PropsWithChildren {
  action?: ActionFn;
  feedback?: boolean;
}

export const Action: FC<ActionProps> = (props) => {
  const { children, feedback, action = () => {} } = props;
  const { callAction, state } = useCallAction(action, { feedback });

  const triggerProps = {
    onPress: callAction,
    isPending: state.isPending,
    isDisabled: state.isExecuting,
    isSucceeded: state.isSucceeded,
    isFailed: state.isFailed,
  };

  const propsContext: PropsContext = {
    Button: triggerProps,
    Action: {
      action: callAction,
    },
  };

  return (
    <PropsContextProvider
      props={propsContext}
      dependencies={Object.values(state)}
    >
      {children}
    </PropsContextProvider>
  );
};

export default Action;
