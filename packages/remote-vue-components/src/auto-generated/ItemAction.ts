/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteItemActionElement } from "@mittwald/flow-remote-elements";
import type { RemoteItemActionElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteItemActionElementProps as ItemActionProps } from "@mittwald/flow-remote-elements";

export const ItemAction: FlowRemoteVueComponent<RemoteItemActionElementProps> =
  createFlowRemoteComponent(
    "flr-item-action",
    "ItemAction",
    RemoteItemActionElement,
    {
      booleans: [
        "aria-current",
        "aria-disabled",
        "aria-expanded",
        "aria-haspopup",
        "aria-pressed",
        "autoFocus",
        "excludeFromTabOrder",
        "formNoValidate",
        "hidden",
        "inert",
        "isDisabled",
        "isFailed",
        "isPending",
        "isReadOnly",
        "isSucceeded",
        "preventFocusOnPress",
        "suppressHydrationWarning",
      ],
    },
  );
