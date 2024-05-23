import type { FlowRenderFn } from "@/lib/types/props";
import type { LinkProps } from "@/components/Link";
import { useActionContext } from "@/components/Action/context";
import { useActionController } from "@/components/Action/lib/execution/useActionController";
import React from "react";

export const ActionLink: FlowRenderFn<LinkProps> = (Link, renderProps) => {
  const { needsConfirmation } = useActionContext();
  const actionController = useActionController();
  const state = actionController.state.useState();

  if (needsConfirmation) {
    return <Link {...renderProps} onPress={actionController.execute} />;
  }

  return (
    <Link
      {...renderProps}
      onPress={actionController.execute}
      aria-disabled={state !== "isIdle"}
    />
  );
};
