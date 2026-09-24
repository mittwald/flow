/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSectionElement } from "@mittwald/flow-remote-elements";
import type { RemoteSectionElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSectionElementProps as SectionProps } from "@mittwald/flow-remote-elements";

export const Section: FlowRemoteVueComponent<RemoteSectionElementProps> =
  createFlowRemoteComponent("flr-section", "Section", RemoteSectionElement, {
    booleans: [
      "autoFocus",
      "defaultChecked",
      "hidden",
      "hideSeparator",
      "inert",
      "itemScope",
      "renderContextMenuSection",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
    ],
  });
