/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteImageElement } from "@mittwald/flow-remote-elements";
import type { RemoteImageElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteImageElementProps as ImageProps } from "@mittwald/flow-remote-elements";

export const Image: FlowRemoteVueComponent<RemoteImageElementProps> =
  createFlowRemoteComponent("flr-image", "Image", RemoteImageElement, {
    booleans: [
      "autoFocus",
      "defaultChecked",
      "hidden",
      "inert",
      "itemScope",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "withBorder",
      "withRoundedCorners",
    ],
  });
