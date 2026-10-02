/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteCopyButtonElement } from "@mittwald/flow-remote-elements";
import type { RemoteCopyButtonElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteCopyButtonElementProps as CopyButtonProps } from "@mittwald/flow-remote-elements";

export const CopyButton: FlowRemoteVueComponent<RemoteCopyButtonElementProps> =
  createFlowRemoteComponent(
    "flr-copy-button",
    "CopyButton",
    RemoteCopyButtonElement,
    {
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
    },
  );
