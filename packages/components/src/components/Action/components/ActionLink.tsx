import type { FlowRenderFn } from "@/lib/types/props";
import type { LinkProps } from "@/components/Link";
import React from "react";
import { ActionModel } from "@/components/Action/models/ActionModel";

export const ActionLink: FlowRenderFn<LinkProps> = (Link, renderProps) => {
  const context = ActionModel.use();
  const state = context.state.useValue();

  if (context.needsConfirmation) {
    return <Link {...renderProps} onPress={context.execute} />;
  }

  return (
    <Link
      {...renderProps}
      onPress={context.execute}
      aria-disabled={state !== "isIdle"}
    />
  );
};
