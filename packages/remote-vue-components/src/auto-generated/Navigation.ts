/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteNavigationElement } from "@mittwald/flow-remote-elements";
import type { RemoteNavigationElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteNavigationElementProps as NavigationProps } from "@mittwald/flow-remote-elements";

export const Navigation: FlowRemoteVueComponent<RemoteNavigationElementProps> =
  createFlowRemoteComponent(
    "flr-navigation",
    "Navigation",
    RemoteNavigationElement,
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
