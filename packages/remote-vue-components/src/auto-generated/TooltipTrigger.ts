/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTooltipTriggerElement } from "@mittwald/flow-remote-elements";
import type { RemoteTooltipTriggerElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTooltipTriggerElementProps as TooltipTriggerProps } from "@mittwald/flow-remote-elements";

export const TooltipTrigger: FlowRemoteVueComponent<RemoteTooltipTriggerElementProps> =
  createFlowRemoteComponent(
    "flr-tooltip-trigger",
    "TooltipTrigger",
    RemoteTooltipTriggerElement,
    { booleans: ["defaultOpen", "isDisabled", "isOpen", "shouldCloseOnPress"] },
  );
