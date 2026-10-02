/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteMessageElement } from "@mittwald/flow-remote-elements";
import type { RemoteMessageElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteMessageElementProps as MessageProps } from "@mittwald/flow-remote-elements";

export const Message: FlowRemoteVueComponent<RemoteMessageElementProps> =
  createFlowRemoteComponent("flr-message", "Message", RemoteMessageElement, {
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
