/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteXAxisElement } from "@mittwald/flow-remote-elements";
import type { RemoteXAxisElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteXAxisElementProps as XAxisProps } from "@mittwald/flow-remote-elements";

export const XAxis: FlowRemoteVueComponent<RemoteXAxisElementProps> =
  createFlowRemoteComponent("flr-x-axis", "XAxis", RemoteXAxisElement, {
    booleans: ["allowDataOverflow", "allowDecimals", "hide"],
  });
