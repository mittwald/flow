/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteOptionElement } from "@mittwald/flow-remote-elements";
import type { RemoteOptionElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteOptionElementProps as OptionProps } from "@mittwald/flow-remote-elements";

export const Option: FlowRemoteVueComponent<RemoteOptionElementProps> =
  createFlowRemoteComponent("flr-option", "Option", RemoteOptionElement, {
    booleans: ["hidden", "inert", "isDisabled"],
  });
