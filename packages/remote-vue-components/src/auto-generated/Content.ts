/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteContentElement } from "@mittwald/flow-remote-elements";
import type { RemoteContentElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteContentElementProps as ContentProps } from "@mittwald/flow-remote-elements";

export const Content: FlowRemoteVueComponent<RemoteContentElementProps> =
  createFlowRemoteComponent("flr-content", "Content", RemoteContentElement, {
    booleans: [
      "aria-checked",
      "aria-current",
      "aria-haspopup",
      "aria-invalid",
      "aria-pressed",
      "autoFocus",
      "defaultChecked",
      "hidden",
      "inert",
      "itemScope",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
    ],
  });
