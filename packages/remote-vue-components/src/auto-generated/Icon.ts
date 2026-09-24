/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteIconElement } from "@mittwald/flow-remote-elements";
import type { RemoteIconElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteIconElementProps as IconProps } from "@mittwald/flow-remote-elements";

export const Icon: FlowRemoteVueComponent<RemoteIconElementProps> =
  createFlowRemoteComponent("flr-icon", "Icon", RemoteIconElement, {
    booleans: ["suppressHydrationWarning"],
  });
