/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteKbdElement } from "@mittwald/flow-remote-elements";
import type { RemoteKbdElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteKbdElementProps as KbdProps } from "@mittwald/flow-remote-elements";

export const Kbd: FlowRemoteVueComponent<RemoteKbdElementProps> =
  createFlowRemoteComponent("flr-kbd", "Kbd", RemoteKbdElement, {
    booleans: ["isDisabled"],
  });
