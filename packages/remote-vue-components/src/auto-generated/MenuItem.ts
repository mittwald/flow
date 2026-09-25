/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteMenuItemElement } from "@mittwald/flow-remote-elements";
import type { RemoteMenuItemElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteMenuItemElementProps as MenuItemProps } from "@mittwald/flow-remote-elements";

export const MenuItem: FlowRemoteVueComponent<RemoteMenuItemElementProps> =
  createFlowRemoteComponent(
    "flr-menu-item",
    "MenuItem",
    RemoteMenuItemElement,
    {
      booleans: [
        "aria-disabled",
        "hidden",
        "inert",
        "isDisabled",
        "isFailed",
        "isPending",
        "isSucceeded",
        "shouldCloseOnSelect",
      ],
    },
  );
