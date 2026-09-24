/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteAccordionElement } from "@mittwald/flow-remote-elements";
import type { RemoteAccordionElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteAccordionElementProps as AccordionProps } from "@mittwald/flow-remote-elements";

export const Accordion: FlowRemoteVueComponent<RemoteAccordionElementProps> =
  createFlowRemoteComponent(
    "flr-accordion",
    "Accordion",
    RemoteAccordionElement,
    {
      booleans: [
        "autoFocus",
        "defaultChecked",
        "defaultExpanded",
        "hidden",
        "inert",
        "itemScope",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
      ],
    },
  );
