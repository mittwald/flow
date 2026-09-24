/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteAlertElement } from "@mittwald/flow-remote-elements";
import type { RemoteAlertElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteAlertElementProps as AlertProps } from "@mittwald/flow-remote-elements";

export const Alert: FlowRemoteVueComponent<RemoteAlertElementProps> =
  createFlowRemoteComponent("flr-alert", "Alert", RemoteAlertElement, {
    booleans: [
      "autoFocus",
      "defaultChecked",
      "hidden",
      "inert",
      "itemScope",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
    ],
  });
