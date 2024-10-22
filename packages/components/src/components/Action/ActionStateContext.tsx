import type { FC, PropsWithChildren } from "react";
import React, { useEffect } from "react";
import { ActionModel } from "@/components/Action/models/ActionModel";
import Action from "@/components/Action/index";

interface Props extends PropsWithChildren {
  isStarted?: boolean;
  hasSucceeded?: boolean;
  hasFailedWithError?: unknown;
}

export const ActionStateContext: FC<Props> = (props) => {
  const { isStarted, hasFailedWithError, hasSucceeded, children } = props;
  const action = ActionModel.useNew({});

  useEffect(() => {
    if (hasSucceeded) {
      void action.state.onSucceeded();
    } else if (hasFailedWithError) {
      void action.state.onFailed(hasFailedWithError);
    } else if (isStarted) {
      void action.state.onAsyncStart();
    }
  }, [isStarted, hasFailedWithError, hasSucceeded]);

  return <Action actionModel={action}>{children}</Action>;
};
