/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteHeaderElement } from "@mittwald/flow-remote-elements";
import type { RemoteHeaderElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteHeaderElementProps as HeaderProps } from "@mittwald/flow-remote-elements";

export const Header: FlowRemoteVueComponent<RemoteHeaderElementProps> =
  createFlowRemoteComponent("flr-header", "Header", RemoteHeaderElement, {
    booleans: [
      "autoFocus",
      "defaultChecked",
      "hidden",
      "inert",
      "itemScope",
      "renderSectionHeader",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
    ],
  });
