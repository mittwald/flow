/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTextAreaElement } from "@mittwald/flow-remote-elements";
import type { RemoteTextAreaElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTextAreaElementProps as TextAreaProps } from "@mittwald/flow-remote-elements";

export const TextArea: FlowRemoteVueComponent<RemoteTextAreaElementProps> =
  createFlowRemoteComponent(
    "flr-text-area",
    "TextArea",
    RemoteTextAreaElement,
    {
      booleans: [
        "allowHorizontalResize",
        "allowVerticalResize",
        "autoFocus",
        "excludeFromTabOrder",
        "hidden",
        "inert",
        "isDisabled",
        "isInvalid",
        "isReadOnly",
        "isRequired",
        "showCharacterCount",
      ],
    },
  );
