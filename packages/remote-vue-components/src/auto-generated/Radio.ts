/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteRadioElement } from "@mittwald/flow-remote-elements";
import type { RemoteRadioElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteRadioElementProps as RadioProps } from "@mittwald/flow-remote-elements";

export const Radio: FlowRemoteVueComponent<RemoteRadioElementProps> =
  createFlowRemoteComponent("flr-radio", "Radio", RemoteRadioElement, {
    booleans: ["autoFocus", "hidden", "inert", "isDisabled"],
  });
