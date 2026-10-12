/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemotePopoverContentElement } from "@mittwald/flow-remote-elements";
import type { RemotePopoverContentElementProps } from "@mittwald/flow-remote-elements";
export { type RemotePopoverContentElementProps as PopoverContentProps } from "@mittwald/flow-remote-elements";

export const PopoverContent: FlowRemoteVueComponent<RemotePopoverContentElementProps> =
  createFlowRemoteComponent(
    "flr-popover-content",
    "PopoverContent",
    RemotePopoverContentElement,
    { booleans: ["isDialogContent", "isOpen", "withTip"] },
  );
