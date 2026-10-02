/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteButtonElement } from "@mittwald/flow-remote-elements";
import type { RemoteButtonElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteButtonElementProps as ButtonProps } from "@mittwald/flow-remote-elements";

export const Button: FlowRemoteVueComponent<RemoteButtonElementProps> =
  createFlowRemoteComponent("flr-button", "Button", RemoteButtonElement, {
    booleans: [
      "aria-disabled",
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
      "unstyled",
    ],
  });
