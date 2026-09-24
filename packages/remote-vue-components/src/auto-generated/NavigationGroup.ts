/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteNavigationGroupElement } from "@mittwald/flow-remote-elements";
import type { RemoteNavigationGroupElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteNavigationGroupElementProps as NavigationGroupProps } from "@mittwald/flow-remote-elements";

export const NavigationGroup: FlowRemoteVueComponent<RemoteNavigationGroupElementProps> =
  createFlowRemoteComponent(
    "flr-navigation-group",
    "NavigationGroup",
    RemoteNavigationGroupElement,
    {
      booleans: [
        "autoFocus",
        "collapsable",
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
