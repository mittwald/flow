/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteCounterBadgeElement } from "@mittwald/flow-remote-elements";
import type { RemoteCounterBadgeElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteCounterBadgeElementProps as CounterBadgeProps } from "@mittwald/flow-remote-elements";

export const CounterBadge: FlowRemoteVueComponent<RemoteCounterBadgeElementProps> =
  createFlowRemoteComponent(
    "flr-counter-badge",
    "CounterBadge",
    RemoteCounterBadgeElement,
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
