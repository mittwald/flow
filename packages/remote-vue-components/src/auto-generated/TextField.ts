/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTextFieldElement } from "@mittwald/flow-remote-elements";
import type { RemoteTextFieldElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTextFieldElementProps as TextFieldProps } from "@mittwald/flow-remote-elements";

export const TextField: FlowRemoteVueComponent<RemoteTextFieldElementProps> =
  createFlowRemoteComponent(
    "flr-text-field",
    "TextField",
    RemoteTextFieldElement,
    {
      booleans: [
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
