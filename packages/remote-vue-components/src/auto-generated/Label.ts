/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteLabelElement } from "@mittwald/flow-remote-elements";
import type { RemoteLabelElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteLabelElementProps as LabelProps } from "@mittwald/flow-remote-elements";

export const Label: FlowRemoteVueComponent<RemoteLabelElementProps> =
  createFlowRemoteComponent("flr-label", "Label", RemoteLabelElement, {
    booleans: [
      "autoFocus",
      "defaultChecked",
      "hidden",
      "inert",
      "isDisabled",
      "itemScope",
      "optional",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "unstyled",
    ],
  });
