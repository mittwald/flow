/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteLinkElement } from "@mittwald/flow-remote-elements";
import type { RemoteLinkElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteLinkElementProps as LinkProps } from "@mittwald/flow-remote-elements";

export const Link: FlowRemoteVueComponent<RemoteLinkElementProps> =
  createFlowRemoteComponent("flr-link", "Link", RemoteLinkElement, {
    booleans: [
      "autoFocus",
      "hidden",
      "inert",
      "inline",
      "isDisabled",
      "unstyled",
    ],
  });
