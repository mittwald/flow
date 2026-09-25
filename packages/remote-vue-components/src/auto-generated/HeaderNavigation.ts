/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteHeaderNavigationElement } from "@mittwald/flow-remote-elements";
import type { RemoteHeaderNavigationElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteHeaderNavigationElementProps as HeaderNavigationProps } from "@mittwald/flow-remote-elements";

export const HeaderNavigation: FlowRemoteVueComponent<RemoteHeaderNavigationElementProps> =
  createFlowRemoteComponent(
    "flr-header-navigation",
    "HeaderNavigation",
    RemoteHeaderNavigationElement,
    {
      booleans: [
        "autoFocus",
        "defaultChecked",
        "hidden",
        "inert",
        "itemScope",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
      ],
    },
  );
