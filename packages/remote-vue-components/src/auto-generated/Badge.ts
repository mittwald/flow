/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteBadgeElement } from "@mittwald/flow-remote-elements";
import type { RemoteBadgeElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteBadgeElementProps as BadgeProps } from "@mittwald/flow-remote-elements";

export const Badge: FlowRemoteVueComponent<RemoteBadgeElementProps> =
  createFlowRemoteComponent("flr-badge", "Badge", RemoteBadgeElement, {
    booleans: ["isDisabled"],
  });
